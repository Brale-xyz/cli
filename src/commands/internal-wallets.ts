import {Flags} from '@oclif/core'
import {BaseCommand} from '../lib/base'
import {getAddresses, getBalances} from '../api'
import {discoverAccount} from '../lib/account-utils'
import {MAINNET_NETWORKS, WalletAddress, getAddressDisplayName} from '../lib/address-utils'
import {formatBalances} from '../lib/balance-utils'

export default class InternalWallets extends BaseCommand<typeof InternalWallets> {
  static description = 'Show your custodial wallet addresses that can be shared with external parties'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --format addresses',
    '<%= config.bin %> <%= command.id %> --network ethereum',
    '<%= config.bin %> <%= command.id %> --network base --format json',
  ]

  static flags = {
    ...BaseCommand.flags,
    format: Flags.string({
      char: 'f',
      description: 'output format',
      options: ['table', 'addresses', 'json'],
      default: 'table',
    }),
    network: Flags.string({
      char: 'n',
      description: 'filter by specific network',
      options: ['ethereum', 'base', 'polygon', 'arbitrum', 'optimism', 'avalanche', 'celo', 'solana', 'bnb', 'canton'],
    }),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(InternalWallets)

    try {
      const config = await this.loadConfig()
      const accountId = await discoverAccount(config)

      // Get addresses and balances
      const [addressesResponse, balancesResponse] = await Promise.all([
        getAddresses(config, accountId),
        getBalances(config, accountId)
      ])

      const addresses = addressesResponse.addresses || []
      const balances = balancesResponse.balances || []

      // Build wallet map from balances
      const walletMap = this.buildWalletMap(balances)
      
      // Add addresses without balances
      await this.addAddressesWithoutBalances(config, accountId, addresses, walletMap)

      // Convert to array and apply filters
      let wallets = Array.from(walletMap.values())
      
      if (flags.network) {
        wallets = wallets.filter(wallet => 
          wallet.networks.includes(flags.network!) || wallet.transfer_type === flags.network
        )
      }

      // Sort by address name
      wallets.sort((a: any, b: any) => (a.address_name || '').localeCompare(b.address_name || ''))

      if (wallets.length === 0) {
        this.log('No custodial wallets found' + (flags.network ? ` for network: ${flags.network}` : ''))
        return
      }

      this.outputWallets(wallets, flags.format as string)

    } catch (error: any) {
      if (error.message.includes('No account found')) {
        this.error('No account found. Please run "brale configure" first.')
      }
      this.error(`Failed to get internal wallets: ${error.message}`)
    }
  }

  private buildWalletMap(balances: any[]): Map<string, WalletAddress> {
    const walletMap = new Map<string, WalletAddress>()

    for (const balance of balances) {
      if (!walletMap.has(balance.address_id)) {
        walletMap.set(balance.address_id, {
          address_id: balance.address_id,
          address_name: getAddressDisplayName(balance),
          on_chain_address: balance.address,
          transfer_type: balance.transfer_type,
          networks: [balance.transfer_type],
          balances: []
        })
      }
      
      const wallet = walletMap.get(balance.address_id)!
      if (!wallet.networks.includes(balance.transfer_type)) {
        wallet.networks.push(balance.transfer_type)
      }
      wallet.balances.push({
        value: balance.balance.value,
        currency: balance.balance.currency,
        value_type: balance.value_type,
        transfer_type: balance.transfer_type
      })
    }

    return walletMap
  }

  private async addAddressesWithoutBalances(
    config: any, 
    accountId: string, 
    addresses: any[], 
    walletMap: Map<string, WalletAddress>
  ): Promise<void> {
    const internalAddresses = addresses.filter((addr: any) => addr.type === 'internal')

    for (const addr of internalAddresses) {
      if (!walletMap.has(addr.id)) {
        const mainnetTransferTypes = addr.transfer_types.filter((type: string) => 
          MAINNET_NETWORKS.includes(type.toLowerCase())
        )

        if (mainnetTransferTypes.length > 0) {
          try {
            const response = await fetch(
              `${config.apiHost}/accounts/${accountId}/addresses/${addr.id}/balance?transfer_type=${mainnetTransferTypes[0]}&value_type=SBC`,
              {
                headers: { 'Authorization': `Bearer ${await this.getToken(config)}` }
              }
            )
            
            if (response.ok) {
              const balanceData = await response.json()
              walletMap.set(addr.id, {
                address_id: addr.id,
                address_name: getAddressDisplayName(addr),
                on_chain_address: balanceData.address.address,
                transfer_type: mainnetTransferTypes[0],
                networks: mainnetTransferTypes,
                balances: []
              })
            }
          } catch (error) {
            // Skip if we can't get the address
            continue
          }
        }
      }
    }
  }

  private async getToken(config: any): Promise<string> {
    const {getToken} = await import('../oauth')
    return getToken(config)
  }

  private outputWallets(wallets: WalletAddress[], format: string): void {
    switch (format) {
      case 'addresses':
        for (const wallet of wallets) {
          this.log(wallet.on_chain_address)
        }
        break

      case 'json':
        this.log(JSON.stringify(wallets, null, 2))
        break

      case 'table':
      default:
        const tableData = wallets.map(wallet => ({
          'AddressID': wallet.address_name,
          'On-Chain Address': wallet.on_chain_address,
          'Networks': wallet.networks.join(', '),
          'Total Balance': formatBalances(wallet.balances)
        }))

        console.table(tableData)

        this.log(`\nFound ${wallets.length} custodial wallet${wallets.length === 1 ? '' : 's'}`)
        if (this.flags.network) {
          this.log(`Filtered by network: ${this.flags.network}`)
        }
        this.log('\nThese addresses can be shared with external parties to receive funds.')
        break
    }
  }
} 