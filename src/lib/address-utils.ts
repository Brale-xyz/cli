import {ApiConfiguration} from '../api'
import {getToken} from '../oauth'

export interface WalletAddress {
  address_id: string
  address_name: string
  on_chain_address: string
  transfer_type: string
  networks: string[]
  balances: Array<{
    value: string
    currency: string
    value_type: string
    transfer_type: string
  }>
}

/**
 * Mainnet networks only (excludes testnets)
 */
export const MAINNET_NETWORKS = [
  'ethereum',
  'base', 
  'polygon',
  'arbitrum',
  'optimism',
  'avalanche',
  'celo',
  'solana',
  'bnb',
  'canton'
]

/**
 * Get on-chain address for a given address ID and transfer type
 */
export async function getOnChainAddress(
  config: ApiConfiguration, 
  accountId: string, 
  addressId: string, 
  transferType: string,
  token?: string
): Promise<string | null> {
  try {
    const bearer = token ?? (await getToken(config))
    const response = await fetch(
      `${config.apiHost}/accounts/${accountId}/addresses/${addressId}/balance?transfer_type=${transferType}&value_type=SBC`,
      {
        headers: { 'Authorization': `Bearer ${bearer}` }
      }
    )
    
    if (response.ok) {
      const balanceData = await response.json()
      return balanceData.address.address
    }
    return null
  } catch (error) {
    return null
  }
}

/**
 * Filter addresses by mainnet networks only
 */
export function filterMainnetAddresses(addresses: any[]): any[] {
  return addresses.filter((addr: any) => {
    if (addr.type !== 'internal') return false
    
    const mainnetTransferTypes = addr.transfer_types.filter((type: string) => 
      MAINNET_NETWORKS.includes(type.toLowerCase())
    )
    return mainnetTransferTypes.length > 0
  })
}

/**
 * Get display name for address (use address ID if name is null)
 */
export function getAddressDisplayName(address: any): string {
  return address.name || address.id
}

/**
 * Find compatible source address for a transfer type
 */
export function findCompatibleSourceAddress(addresses: any[], transferType: string): any | null {
  return addresses.find((addr: any) => 
    addr.type === 'internal' && 
    addr.transfer_types.includes(transferType.toLowerCase())
  ) || null
} 