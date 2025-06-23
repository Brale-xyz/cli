import {ApiConfiguration, getBalances, getAddresses, createTransfer} from '../api'
import {formatBalance} from './balance-utils'
import {findCompatibleSourceAddress, getAddressDisplayName} from './address-utils'
import {BaseCommand} from './base'

export interface RecoveryOption {
  id: string
  type: 'direct_transfer' | 'token_swap' | 'cross_chain'
  description: string
  confidence: 'high' | 'medium' | 'low'
  estimatedTime: string
  steps: RecoveryStep[]
  cost?: {
    amount: string
    currency: string
  }
}

export interface RecoveryStep {
  action: string
  from?: {
    address_id: string
    address_name: string
    value_type: string
    transfer_type: string
  }
  to?: {
    address_id: string
    address_name: string
    value_type: string
    transfer_type: string
  }
  amount?: {
    value: string
    currency: string
  }
  isInternal: boolean
}

export interface SmartRecoveryAnalysis {
  canRecover: boolean
  requiredAmount: string
  requiredCurrency: string
  requiredNetwork: string
  availableBalances: Array<{
    address_id: string
    address_name: string
    balance: {value: string, currency: string}
    value_type: string
    transfer_type: string
  }>
  recoveryOptions: RecoveryOption[]
  recommendedOption?: RecoveryOption
}

export class SmartRecovery {
  constructor(
    private config: ApiConfiguration,
    private accountId: string,
    private token: string,
    private logger: BaseCommand<any>
  ) {}

  async analyzeTransferFailure(
    amount: string,
    valueType: string,
    transferType: string,
    _error: Error
  ): Promise<SmartRecoveryAnalysis> {
    this.logger.log('\n🔍 Smart Recovery: Analyzing transfer failure...')
    
    // Get all available balances
    const balancesResponse = await getBalances(this.config, this.accountId, this.token)
    const availableBalances = balancesResponse.balances || []
    
    // Get all addresses for context
    const addressesResponse = await getAddresses(this.config, this.accountId, this.token)
    const addresses = addressesResponse.addresses || []
    const internalAddresses = addresses.filter((a: any) => a.type === 'internal')
    
    // Check if we have the exact amount needed
    const exactMatch = availableBalances.find(b => 
      b.value_type === valueType && 
      b.transfer_type === transferType && 
      parseFloat(b.balance.value) >= parseFloat(amount)
    )
    
    if (exactMatch) {
      // This shouldn't happen if the transfer failed, but handle it
      return {
        canRecover: false,
        requiredAmount: amount,
        requiredCurrency: valueType,
        requiredNetwork: transferType,
        availableBalances,
        recoveryOptions: [],
      }
    }
    
    // Generate recovery options
    const recoveryOptions = await this.generateRecoveryOptions(
      amount,
      valueType,
      transferType,
      availableBalances,
      internalAddresses
    )
    
    const recommendedOption = this.selectRecommendedOption(recoveryOptions)
    
    return {
      canRecover: recoveryOptions.length > 0,
      requiredAmount: amount,
      requiredCurrency: valueType,
      requiredNetwork: transferType,
      availableBalances,
      recoveryOptions,
      recommendedOption
    }
  }

  private async generateRecoveryOptions(
    amount: string,
    valueType: string,
    transferType: string,
    availableBalances: any[],
    internalAddresses: any[]
  ): Promise<RecoveryOption[]> {
    const options: RecoveryOption[] = []
    const requiredAmount = parseFloat(amount)
    
    // Analyze available balances for recovery options
    
    // Option 1: Direct transfer from same token on different network
    const sameTokenDifferentNetwork = availableBalances.filter(b => 
      b.value_type === valueType && 
      b.transfer_type !== transferType &&
      parseFloat(b.balance.value) >= requiredAmount
    )
    
    // Check for same token on different networks
    
    for (const balance of sameTokenDifferentNetwork) {
      const targetAddress = findCompatibleSourceAddress(internalAddresses, transferType)
      if (targetAddress) {
        options.push({
          id: `direct-${balance.transfer_type}-to-${transferType}`,
          type: 'cross_chain',
          description: `Transfer ${formatBalance(amount, valueType)} from ${balance.transfer_type} to ${transferType}`,
          confidence: 'high',
          estimatedTime: '2-5 minutes',
          steps: [
            {
              action: `Transfer ${formatBalance(amount, valueType)} from ${balance.transfer_type} to ${transferType}`,
              from: {
                address_id: balance.address_id,
                address_name: balance.address_name,
                value_type: valueType,
                transfer_type: balance.transfer_type
              },
              to: {
                address_id: targetAddress.id,
                address_name: getAddressDisplayName(targetAddress),
                value_type: valueType,
                transfer_type: transferType
              },
              amount: {value: amount, currency: 'USD'},
              isInternal: true
            }
          ]
        })
        // Added cross-chain transfer option
      }
    }
    
    // Option 2: Token swap on same network
    const sameNetworkDifferentToken = availableBalances.filter(b => 
      b.value_type !== valueType && 
      b.transfer_type === transferType &&
      parseFloat(b.balance.value) >= requiredAmount // Removed 1.1 buffer
    )
    
    // Check for token swaps on same network
    
    for (const balance of sameNetworkDifferentToken) {
      options.push({
        id: `swap-${balance.value_type}-to-${valueType}`,
        type: 'token_swap',
        description: `Swap ${balance.value_type} to ${valueType} on ${transferType}`,
        confidence: 'medium',
        estimatedTime: '1-3 minutes',
        cost: {
          amount: (requiredAmount * 0.003).toFixed(6), // Estimate 0.3% swap fee
          currency: balance.value_type
        },
        steps: [
          {
            action: `Swap ${formatBalance(amount, balance.value_type)} to ${formatBalance(amount, valueType)}`,
            from: {
              address_id: balance.address_id,
              address_name: balance.address_name,
              value_type: balance.value_type,
              transfer_type: transferType
            },
            to: {
              address_id: balance.address_id,
              address_name: balance.address_name,
              value_type: valueType,
              transfer_type: transferType
            },
            amount: {value: amount, currency: 'USD'},
            isInternal: true
          }
        ]
      })
      this.logger.log(`   ✅ Added token swap: ${balance.value_type} → ${valueType} on ${transferType}`)
    }
    
    // Option 3: Multi-step recovery (cross-chain + swap) - ONLY for different tokens
    const multiStepSources = availableBalances.filter(b => 
      b.value_type !== valueType && // MUST be different token
      b.transfer_type !== transferType && // MUST be different network
      parseFloat(b.balance.value) >= requiredAmount // Removed 1.15 buffer
    )
    
    this.logger.log(`\n🔍 Multi-step (different token + network) options: ${multiStepSources.length}`)
    multiStepSources.forEach((b, i) => {
      this.logger.log(`   ${i+1}. ${b.balance.value} ${b.value_type} on ${b.transfer_type} (need ${valueType} on ${transferType})`)
    })
    
    for (const balance of multiStepSources) {
      const intermediateAddress = findCompatibleSourceAddress(internalAddresses, transferType)
      if (intermediateAddress) {
        options.push({
          id: `multi-${balance.transfer_type}-${balance.value_type}-to-${transferType}-${valueType}`,
          type: 'cross_chain',
          description: `Cross-chain transfer + swap: ${balance.value_type} (${balance.transfer_type}) → ${valueType} (${transferType})`,
          confidence: 'low',
          estimatedTime: '5-10 minutes',
          cost: {
            amount: (requiredAmount * 0.008).toFixed(6), // Estimate 0.8% total fees
            currency: balance.value_type
          },
          steps: [
            {
              action: `Transfer ${formatBalance(amount, balance.value_type)} from ${balance.transfer_type} to ${transferType}`,
              from: {
                address_id: balance.address_id,
                address_name: balance.address_name,
                value_type: balance.value_type,
                transfer_type: balance.transfer_type
              },
              to: {
                address_id: intermediateAddress.id,
                address_name: getAddressDisplayName(intermediateAddress),
                value_type: balance.value_type,
                transfer_type: transferType
              },
              amount: {value: amount, currency: 'USD'},
              isInternal: true
            },
            {
              action: `Swap ${balance.value_type} to ${valueType} on ${transferType}`,
              from: {
                address_id: intermediateAddress.id,
                address_name: getAddressDisplayName(intermediateAddress),
                value_type: balance.value_type,
                transfer_type: transferType
              },
              to: {
                address_id: intermediateAddress.id,
                address_name: getAddressDisplayName(intermediateAddress),
                value_type: valueType,
                transfer_type: transferType
              },
              amount: {value: amount, currency: 'USD'},
              isInternal: true
            }
          ]
        })
        this.logger.log(`   ✅ Added multi-step: ${balance.value_type} (${balance.transfer_type}) → ${valueType} (${transferType})`)
      }
    }
    
    this.logger.log(`\n🔍 Total recovery options generated: ${options.length}`)
    
    return options.slice(0, 3) // Limit to top 3 options
  }
  
  private selectRecommendedOption(options: RecoveryOption[]): RecoveryOption | undefined {
    if (options.length === 0) return undefined
    
    // Priority: high confidence > fewer steps > lower cost
    const highConfidence = options.filter(o => o.confidence === 'high')
    if (highConfidence.length > 0) {
      return highConfidence.reduce((best, current) => 
        current.steps.length < best.steps.length ? current : best
      )
    }
    
    const mediumConfidence = options.filter(o => o.confidence === 'medium')
    if (mediumConfidence.length > 0) {
      return mediumConfidence[0]
    }
    
    return options[0]
  }
  
  async presentRecoveryOptions(analysis: SmartRecoveryAnalysis): Promise<void> {
    if (!analysis.canRecover) {
      this.logger.log('\n💔 Smart Recovery: No recovery options available')
      this.logger.log(`   Required: ${formatBalance(analysis.requiredAmount, analysis.requiredCurrency)} on ${analysis.requiredNetwork}`)
      
      if (analysis.availableBalances.length > 0) {
        this.logger.log('\n💰 Available balances:')
        for (const balance of analysis.availableBalances) {
          this.logger.log(`   ${formatBalance(balance.balance.value, balance.value_type)} on ${balance.transfer_type} (${balance.address_name})`)
        }
      } else {
        this.logger.log('\n💸 No funds available in custodial wallets')
      }
      return
    }
    
    this.logger.log('\n🛠️  Smart Recovery: Found recovery options!')
    this.logger.log(`   Need: ${formatBalance(analysis.requiredAmount, analysis.requiredCurrency)} on ${analysis.requiredNetwork}`)
    
    if (analysis.recommendedOption) {
      this.logger.log(`\n⭐ Recommended: ${analysis.recommendedOption.description}`)
      this.logger.log(`   Confidence: ${analysis.recommendedOption.confidence}`)
      this.logger.log(`   Time: ${analysis.recommendedOption.estimatedTime}`)
      if (analysis.recommendedOption.cost) {
        this.logger.log(`   Cost: ~${formatBalance(analysis.recommendedOption.cost.amount, analysis.recommendedOption.cost.currency)}`)
      }
    }
    
    this.logger.log('\n📋 All recovery options:')
    analysis.recoveryOptions.forEach((option, index) => {
      this.logger.log(`\n${index + 1}. ${option.description}`)
      this.logger.log(`   Confidence: ${option.confidence} | Time: ${option.estimatedTime}`)
      if (option.cost) {
        this.logger.log(`   Cost: ~${formatBalance(option.cost.amount, option.cost.currency)}`)
      }
      
      this.logger.log('   Steps:')
      option.steps.forEach((step, stepIndex) => {
        this.logger.log(`     ${stepIndex + 1}. ${step.action}`)
      })
    })
  }
  
  private async waitForTransferCompletion(transferId: string, maxWaitMinutes: number = 5): Promise<boolean> {
    const maxAttempts = maxWaitMinutes * 6 // Check every 10 seconds instead of 30
    let attempts = 0
    
    this.logger.log(`   ⏳ Monitoring transfer ${transferId}...`)
    
    while (attempts < maxAttempts) {
      try {
        const {getTransfer} = await import('../api')
        const transferStatus = await getTransfer(this.config, this.accountId, transferId, this.token)
        
        this.logger.log(`   📊 Status: ${transferStatus.status} (${Math.round(attempts * 10)}s elapsed)`)
        
        // Handle both 'completed' and 'complete' status - exit immediately
        if (transferStatus.status === 'completed' || transferStatus.status === 'complete') {
          this.logger.log(`   ✅ Transfer completed successfully!`)
          return true // Exit immediately, no more polling needed
        } 
        
        if (transferStatus.status === 'failed' || transferStatus.status === 'cancelled') {
          this.logger.log(`   ❌ Transfer failed with status: ${transferStatus.status}`)
          return false
        }
        
        // For any other status (processing, pending, etc.), continue polling
        if (attempts < maxAttempts - 1) { // Don't wait on the last attempt
          await new Promise(resolve => setTimeout(resolve, 10000)) // 10 seconds instead of 30
        }
        attempts++
        
      } catch (error: any) {
        this.logger.log(`   ⚠️  Error checking transfer status: ${error.message}`)
        if (attempts < maxAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, 10000))
        }
        attempts++
      }
    }
    
    this.logger.log(`   ⏰ Transfer monitoring timed out after ${maxWaitMinutes} minutes`)
    return false
  }

  private async verifyBalanceAvailable(
    addressId: string, 
    requiredAmount: string, 
    valueType: string, 
    transferType: string
  ): Promise<boolean> {
    try {
      this.logger.log(`   🔍 Verifying balance on ${transferType}...`)
      
      const response = await fetch(
        `${this.config.apiHost}/accounts/${this.accountId}/addresses/${addressId}/balance?transfer_type=${transferType}&value_type=${valueType}`,
        {
          headers: { 'Authorization': `Bearer ${this.token}` }
        }
      )
      
      if (response.ok) {
        const balanceData = await response.json()
        const availableBalance = parseFloat(balanceData.balance.value)
        const required = parseFloat(requiredAmount)
        
        this.logger.log(`   💰 Available: ${availableBalance} ${valueType}, Required: ${required} ${valueType}`)
        
        if (availableBalance >= required) {
          this.logger.log(`   ✅ Sufficient balance confirmed!`)
          return true
        } else {
          this.logger.log(`   ⚠️  Insufficient balance: need ${required - availableBalance} more ${valueType}`)
          return false
        }
      } else {
        this.logger.log(`   ⚠️  Could not check balance: ${response.status}`)
        return false
      }
    } catch (error: any) {
      this.logger.log(`   ⚠️  Error verifying balance: ${error.message}`)
      return false
    }
  }

  async executeRecoveryOption(option: RecoveryOption, originalTransferArgs: any): Promise<boolean> {
    this.logger.log(`\n🚀 Executing Smart Recovery: ${option.description}`)
    
    try {
      // Phase 1: Execute internal funding steps
      this.logger.log('\n📍 Phase 1: Internal funding operations')
      const internalSteps = option.steps.filter(step => step.isInternal)
      const transferIds: string[] = []
      
      for (const [index, step] of internalSteps.entries()) {
        this.logger.log(`\n   Step ${index + 1}: ${step.action}`)
        
        if (step.from && step.to && step.amount) {
          // Execute internal transfer
          const transferData = {
            amount: step.amount,
            source: {
              address_id: step.from.address_id,
              value_type: step.from.value_type,
              transfer_type: step.from.transfer_type
            },
            destination: {
              address_id: step.to.address_id,
              value_type: step.to.value_type,
              transfer_type: step.to.transfer_type
            },
            note: `Smart Recovery: ${step.action}`
          }
          
          // For swaps, we'd need to integrate with DEX APIs
          if (option.type === 'token_swap') {
            this.logger.log('   ⚠️  Token swap functionality requires DEX integration')
            this.logger.log('   💡 This would connect to Uniswap/1inch APIs for the swap')
            this.logger.log('   ✅ Simulated: Swap completed successfully')
          } else {
            // Execute cross-chain transfer
            const response = await createTransfer(this.config, this.accountId, transferData, this.token)
            this.logger.log(`   ✅ Internal transfer initiated: ${response.id}`)
            transferIds.push(response.id)
            
            // Wait for this transfer to complete before proceeding
            const completed = await this.waitForTransferCompletion(response.id, 10)
            if (!completed) {
              this.logger.log(`   ❌ Transfer ${response.id} did not complete in time`)
              return false
            }
          }
        }
      }
      
      this.logger.log('\n✅ Phase 1 completed: All internal transfers confirmed')
      
      // Phase 1.5: Verify balance is available for external transfer
      this.logger.log('\n📍 Phase 1.5: Balance verification')
      
      // Find the target address that should now have the funds
      const finalStep = internalSteps[internalSteps.length - 1]
      if (finalStep && finalStep.to) {
        const balanceAvailable = await this.verifyBalanceAvailable(
          finalStep.to.address_id,
          originalTransferArgs.amount,
          originalTransferArgs.valueType,
          originalTransferArgs.transferType
        )
        
        if (!balanceAvailable) {
          this.logger.log('\n❌ Balance verification failed - funds not yet available')
          this.logger.log('💡 The internal transfer may need more time to complete')
          return false
        }
      }
      
      // Phase 2: Ready for external transfer
      this.logger.log('\n📍 Phase 2: Ready for external transfer')
      this.logger.log(`   ✅ Confirmed: ${formatBalance(originalTransferArgs.amount, originalTransferArgs.valueType)} available on ${originalTransferArgs.transferType}`)
      this.logger.log(`   🎯 Target: ${originalTransferArgs.wallet}`)
      
      return true
      
    } catch (error: any) {
      this.logger.log(`\n❌ Recovery failed: ${error.message}`)
      return false
    }
  }
}