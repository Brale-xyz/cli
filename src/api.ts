import {getToken} from './oauth'

export type ApiConfiguration = {
  apiHost: string
  authHost: string
  clientId: string
  clientSecret: string
}

export async function getAccounts(config: ApiConfiguration, token?: string) {
  const t = token ?? (await getToken(config))
  const response = await fetch(`${config.apiHost}/accounts`, {
    headers: { 'Authorization': `Bearer ${t}` }
  })
  
  if (!response.ok) {
    throw new Error(`Failed to get accounts: ${response.status} ${response.statusText}`)
  }
  
  return response.json()
}

export async function getAccount(config: ApiConfiguration, accountId: string, token?: string) {
  const t = token ?? (await getToken(config))
  const response = await fetch(`${config.apiHost}/accounts/${accountId}`, {
    headers: { 'Authorization': `Bearer ${t}` }
  })
  
  if (!response.ok) {
    throw new Error(`Failed to get account: ${response.status} ${response.statusText}`)
  }
  
  return response.json()
}

export async function getAddresses(config: ApiConfiguration, accountId: string, token?: string) {
  const t = token ?? (await getToken(config))
  const response = await fetch(`${config.apiHost}/accounts/${accountId}/addresses`, {
    headers: { 'Authorization': `Bearer ${t}` }
  })
  
  if (!response.ok) {
    throw new Error(`Failed to get addresses: ${response.status} ${response.statusText}`)
  }
  
  return response.json()
}

export async function getBalances(config: ApiConfiguration, accountId: string, token?: string) {
  const t = token ?? (await getToken(config))
  
  // First get all addresses to check their balances
  const addressesResponse = await getAddresses(config, accountId, t)
  const addresses = addressesResponse.addresses || []
  
  // Filter for internal addresses (custodial wallets)
  const internalAddresses = addresses.filter((addr: any) => addr.type === 'internal')
  
  // Define mainnet networks only (exclude testnets)
  const mainnetNetworks = [
    'ethereum',
    'base', 
    'polygon',
    'arbitrum',
    'optimism',
    'avalanche',
    'celo',
    'solana',
    'bnb',
    'canton' // Canton mainnet
  ]
  
  const balances = []
  
  // Check balance for each internal address across mainnet transfer types only
  for (const address of internalAddresses) {
    // Filter transfer types to mainnet only
    const mainnetTransferTypes = address.transfer_types.filter((type: string) => 
      mainnetNetworks.includes(type.toLowerCase())
    )
    
    for (const transferType of mainnetTransferTypes) {
      // Try common value types
      const valueTypes = ['SBC', 'USDC', 'USD']
      
      for (const valueType of valueTypes) {
        try {
          const response = await fetch(
            `${config.apiHost}/accounts/${accountId}/addresses/${address.id}/balance?transfer_type=${transferType}&value_type=${valueType}`,
            {
              headers: { 'Authorization': `Bearer ${t}` }
            }
          )
          
          if (response.ok) {
            const balanceData = await response.json()
            if (balanceData.balance && parseFloat(balanceData.balance.value) > 0) {
              balances.push({
                address_id: address.id,
                address_name: address.name,
                address: balanceData.address.address,
                balance: balanceData.balance,
                value_type: balanceData.value_type,
                transfer_type: balanceData.transfer_type
              })
            }
          }
        } catch (error) {
          // Skip failed balance checks
          continue
        }
      }
    }
  }
  
  return { balances }
}

export async function createTransfer(config: ApiConfiguration, accountId: string, transferData: any, token?: string) {
  const t = token ?? (await getToken(config))
  const response = await fetch(`${config.apiHost}/accounts/${accountId}/transfers`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${t}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    },
    body: JSON.stringify(transferData)
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to create transfer: ${response.status} ${response.statusText} - ${errorText}`)
  }
  
  return response.json()
}

export async function getTransfer(config: ApiConfiguration, accountId: string, transferId: string, token?: string) {
  const t = token ?? (await getToken(config))
  const response = await fetch(`${config.apiHost}/accounts/${accountId}/transfers/${transferId}`, {
    headers: { 'Authorization': `Bearer ${t}` }
  })
  
  if (!response.ok) {
    throw new Error(`Failed to get transfer: ${response.status} ${response.statusText}`)
  }
  
  return response.json()
}

export async function getTransfers(config: ApiConfiguration, accountId: string, token?: string) {
  const t = token ?? (await getToken(config))
  const response = await fetch(`${config.apiHost}/accounts/${accountId}/transfers`, {
    headers: { 'Authorization': `Bearer ${t}` }
  })
  
  if (!response.ok) {
    throw new Error(`Failed to get transfers: ${response.status} ${response.statusText}`)
  }
  
  return response.json()
}

export async function createExternalAddress(config: ApiConfiguration, accountId: string, addressData: any, token?: string) {
  const t = token ?? (await getToken(config))
  const response = await fetch(`${config.apiHost}/accounts/${accountId}/addresses/external`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${t}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    },
    body: JSON.stringify(addressData)
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to create external address: ${response.status} ${response.statusText} - ${errorText}`)
  }
  
  return response.json()
}
