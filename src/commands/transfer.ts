import {Args, Flags} from '@oclif/core'
import {createTransfer, getAddresses, createExternalAddress} from '../api'
import {getToken} from '../oauth'
import {BaseCommand} from '../lib/base'
import {getAccountWithErrorHandling} from '../lib/account-utils'
import {findCompatibleSourceAddress, getAddressDisplayName} from '../lib/address-utils'
import {SmartRecovery} from '../lib/smart-recovery'
import * as readline from 'readline'

export default class Transfer extends BaseCommand<typeof Transfer> {
  static args = {
    amount: Args.string({description: 'Amount to transfer', required: true}),
    wallet: Args.string({description: 'Destination wallet address', required: true}),
    valueType: Args.string({description: 'Value type (SBC, USDC, etc.)', required: true}),
    transferType: Args.string({description: 'Transfer type (base, ethereum, polygon, etc.)', required: true}),
  }

  static description = 'Send tokens from your custodial wallet to an external wallet'

  static examples = [
    '<%= config.bin %> <%= command.id %> 100 0x1234...abcd SBC base',
    '<%= config.bin %> <%= command.id %> 50 0x5678...efgh USDC polygon',
    '<%= config.bin %> <%= command.id %> 25 0x9abc...def0 SBC ethereum',
  ]

  static flags = {
    'account-id': Flags.string({char: 'a', description: 'Account ID (if not provided, will use first available account)'}),
    'source-address-id': Flags.string({char: 's', description: 'Source address ID (if not provided, will auto-select compatible address)'}),
    'note': Flags.string({char: 'n', description: 'Transfer note'}),
    'memo': Flags.string({char: 'm', description: 'Transfer memo'}),
    'dry-run': Flags.boolean({char: 'd', description: 'Show what would be transferred without executing'}),
    'smart-recovery': Flags.boolean({description: 'Enable Smart Recovery for failed transfers', default: true, allowNo: true}),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(Transfer)
    let config: any
    let bearer: string
    let accountId: string | undefined

    try {
      config = await this.loadConfig()
      bearer = await getToken(config)

      // Step 1: Get account ID (auto-discover if not provided)
      accountId = await this.getAccountId(config, flags['account-id'], bearer)

      // Step 2: Get addresses and find compatible source address
      const sourceAddress = await this.getSourceAddress(config, accountId, args.transferType, flags['source-address-id'], bearer)

      // Step 3: Handle dry run
      if (flags['dry-run']) {
        this.showDryRunPreview(args, flags, sourceAddress)
        return
      }

      // Step 4: Find or create external address
      const externalAddressId = await this.getOrCreateExternalAddress(config, accountId, args, bearer)

      // Step 5: Execute transfer
      await this.executeTransfer(config, accountId, args, flags, sourceAddress.id, externalAddressId, bearer)

    } catch (error: any) {
      await this.handleTransferError(error, args, flags, config, bearer!, accountId)
    }
  }

  private async getAccountId(config: any, providedAccountId: string | undefined, bearer: string): Promise<string> {
    const accountId = await getAccountWithErrorHandling(config, providedAccountId, bearer)
    
    if (!providedAccountId) {
      this.log('🔍 Auto-discovering account...')
      this.log(`🏢 Using account: ${accountId}`)
    }
    
    return accountId
  }

  private async getSourceAddress(
    config: any, 
    accountId: string, 
    transferType: string, 
    providedSourceId: string | undefined,
    bearer: string
  ): Promise<any> {
    this.log('📍 Finding compatible source address...')
    
    const addressesResponse = await getAddresses(config, accountId, bearer)
    const addresses = addressesResponse.addresses || []
    
    if (providedSourceId) {
      const sourceAddress = addresses.find((addr: any) => 
        addr.id === providedSourceId && 
        addr.type === 'internal' && 
        addr.transfer_types.includes(transferType.toLowerCase())
      )
      
      if (!sourceAddress) {
        throw new Error(`Source address ${providedSourceId} not found or not compatible with ${transferType}`)
      }
      
      return sourceAddress
    }

    const compatibleAddress = findCompatibleSourceAddress(addresses, transferType)
    
    if (!compatibleAddress) {
      const internalAddresses = addresses.filter((a: any) => a.type === 'internal')
      const availableNetworks = internalAddresses.map((a: any) => a.transfer_types.join(', ')).join(' | ')
      throw new Error(`No custodial addresses found that support ${transferType} transfers. Available networks: ${availableNetworks}`)
    }

    this.log(`💰 Using source address: ${getAddressDisplayName(compatibleAddress)} (${compatibleAddress.id})`)
    return compatibleAddress
  }

  private showDryRunPreview(args: any, flags: any, sourceAddress: any): void {
    this.log('\n🧪 DRY RUN - Transfer would be:')
    this.log(`   Amount: ${args.amount} ${args.valueType}`)
    this.log(`   From: ${getAddressDisplayName(sourceAddress)} (${sourceAddress.id})`)
    this.log(`   From Address: ${sourceAddress.address}`)
    this.log(`   To: ${args.wallet}`)
    this.log(`   Network: ${args.transferType}`)
    if (flags.note) this.log(`   Note: ${flags.note}`)
    if (flags.memo) this.log(`   Memo: ${flags.memo}`)
    this.log('\n📝 Will create external address first, then transfer')
    this.log('\n✅ Use without --dry-run to execute')
  }

  private async getOrCreateExternalAddress(
    config: any, 
    accountId: string, 
    args: any, 
    bearer: string
  ): Promise<string> {
    this.log('🔍 Looking for existing external address...')
    
    const addressesResponse = await getAddresses(config, accountId, bearer)
    const addresses = addressesResponse.addresses || []
    
    // Check if external address already exists
    const existingAddress = addresses.find((addr: any) => 
      addr.type === 'external' && 
      addr.address.toLowerCase() === args.wallet.toLowerCase() &&
      addr.transfer_types.includes(args.transferType)
    )
    
    if (existingAddress) {
      this.log(`📝 Using existing external address: ${existingAddress.id}`)
      return existingAddress.id
    }

    this.log('🔗 Creating new external address...')
    const externalAddressData = {
      name: `External Wallet ${args.wallet.slice(0, 6)}...${args.wallet.slice(-4)}`,
      address: args.wallet,
      transfer_types: [args.transferType]
    }
    
    const externalAddressResponse = await createExternalAddress(config, accountId, externalAddressData, bearer)
    this.log(`📝 External address created: ${externalAddressResponse.id}`)
    return externalAddressResponse.id
  }

  private async executeTransfer(
    config: any,
    accountId: string,
    args: any,
    flags: any,
    sourceAddressId: string,
    externalAddressId: string,
    bearer: string
  ): Promise<void> {
    const transferData = {
      amount: { 
        value: args.amount, 
        currency: 'USD' // Amount is always in USD for API
      },
      source: {
        address_id: sourceAddressId,
        value_type: args.valueType,
        transfer_type: args.transferType
      },
      destination: {
        address_id: externalAddressId,
        value_type: args.valueType,
        transfer_type: args.transferType,
        ...(flags.memo && { memo: flags.memo })
      },
      ...(flags.note && { note: flags.note })
    }

    this.log(`\n💸 Creating transfer...`)
    this.log(`   ${args.amount} ${args.valueType} → ${args.wallet}`)
    this.log(`   Network: ${args.transferType}`)

    const response = await createTransfer(config, accountId, transferData, bearer)
    
    this.log(`\n✅ Transfer created successfully!`)
    this.log(`   Transfer ID: ${response.id}`)
    this.log(`   Status: ${response.status}`)
    this.log(`   Created: ${response.created_at}`)
    
    if (response.status === 'pending') {
      this.log(`\n⏳ Transfer is pending. Check status with:`)
      this.log(`   brale transfers get ${accountId} ${response.id}`)
    }

    if (response.transaction_hash) {
      this.log(`   Transaction: ${response.transaction_hash}`)
    }
  }

  private async promptUser(question: string): Promise<boolean> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    
    return new Promise((resolve) => {
      rl.question(`${question} (y/N): `, (answer) => {
        rl.close()
        resolve(answer.toLowerCase().startsWith('y'))
      })
    })
  }

  private async handleTransferError(
    error: any, 
    args: any, 
    flags: any, 
    config?: any, 
    bearer?: string, 
    accountId?: string
  ): Promise<void> {
    this.log(`❌ Error creating transfer: ${error.message}`)
    
    // Try Smart Recovery if enabled and we have the necessary context
    if (flags['smart-recovery'] && config && bearer && accountId) {
      try {
        const smartRecovery = new SmartRecovery(config, accountId, bearer, this)
        const analysis = await smartRecovery.analyzeTransferFailure(
          args.amount,
          args.valueType,
          args.transferType,
          error
        )
        
        await smartRecovery.presentRecoveryOptions(analysis)
        
        if (analysis.canRecover && analysis.recoveryOptions.length > 0) {
          // Interactive prompt
          const proceed = await this.promptUser('\n❓ Would you like to proceed with Smart Recovery?')
          
          if (proceed) {
            this.log('\n🚀 Starting Smart Recovery...')
            
            // Try recovery options in order of preference
            let success = false
            for (const [index, option] of analysis.recoveryOptions.entries()) {
              if (index > 0) {
                this.log(`\n🔄 Trying alternative recovery option ${index + 1}...`)
              }
              
              success = await smartRecovery.executeRecoveryOption(option, args)
              
              if (success) {
                this.log('\n✅ Smart Recovery completed! Retrying external transfer...')
                // Retry the original transfer
                try {
                  // Get source address again since we need it for retry
                  const sourceAddress = await this.getSourceAddress(config, accountId, args.transferType, flags['source-address-id'], bearer)
                  const externalAddressId = await this.getOrCreateExternalAddress(config, accountId, args, bearer)
                  await this.executeTransfer(config, accountId, args, flags, sourceAddress.id, externalAddressId, bearer)
                  break // Success! Exit the loop
                } catch (retryError: any) {
                  this.log(`❌ Retry failed: ${retryError.message}`)
                  // Continue to next recovery option if available
                  if (index < analysis.recoveryOptions.length - 1) {
                    this.log(`💡 Will try next recovery option...`)
                    success = false
                  }
                }
              } else {
                this.log(`\n❌ Recovery option ${index + 1} failed`)
                // Continue to next recovery option if available
                if (index < analysis.recoveryOptions.length - 1) {
                  this.log(`💡 Trying next recovery option...`)
                }
              }
            }
            
            if (!success) {
              this.log('\n💔 All Smart Recovery options exhausted')
              this.log('💡 You may need to wait for pending transfers or add more funds')
            }
          } else {
            this.log('\n❌ Smart Recovery cancelled by user')
          }
        }
        
        return
      } catch (recoveryError: any) {
        this.log(`\n⚠️  Smart Recovery failed: ${recoveryError.message}`)
        this.log('Falling back to basic error handling...')
      }
    }
    
    // Fallback to basic error handling
    if (error.message.includes('account')) {
      try {
        const fallbackConfig = config || await this.loadConfig()
        const fallbackBearer = bearer || await getToken(fallbackConfig)
        const {getAccounts} = await import('../api')
        const accountsResponse = await getAccounts(fallbackConfig, fallbackBearer)
        const accounts = accountsResponse.accounts || []
        if (accounts.length > 0) {
          this.log(`\n💡 Available accounts: ${accounts.join(', ')}`)
          this.log(`   Try: brale transfer ${args.amount} ${args.wallet} ${args.valueType} ${args.transferType} --account-id ${accounts[0]}`)
        }
      } catch {}
    }
    
    // General recovery hints
    this.log('\n💡 Recovery suggestions:')
    this.log('   • Check your balance: brale balances')
    this.log('   • View available addresses: brale addresses')
    this.log('   • Try a different network or token')
    this.log('   • Use --smart-recovery flag for automatic funding options')
  }
} 