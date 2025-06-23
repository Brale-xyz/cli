import {ApiConfiguration, getAccounts} from '../api'
import {getToken} from '../oauth'

/**
 * Auto-discover the first available account
 */
export async function discoverAccount(config: ApiConfiguration, token?: string): Promise<string> {
  const bearer = token ?? (await getToken(config))
  const accountsResponse = await getAccounts(config, bearer)
  const accounts = accountsResponse.accounts || []
  
  if (accounts.length === 0) {
    throw new Error('No accounts found. Please run `brale configure` first.')
  }
  
  return accounts[0]
}

/**
 * Validate account ID format
 */
export function isValidAccountId(accountId: string): boolean {
  // Brale account IDs are typically 27 characters long and alphanumeric
  return /^[A-Za-z0-9]{20,30}$/.test(accountId)
}

/**
 * Get account with helpful error messages
 */
export async function getAccountWithErrorHandling(
  config: ApiConfiguration, 
  accountId?: string,
  token?: string
): Promise<string> {
  try {
    if (accountId) {
      if (!isValidAccountId(accountId)) {
        throw new Error(`Invalid account ID format: ${accountId}`)
      }
      return accountId
    }
    
    return await discoverAccount(config, token)
  } catch (error: any) {
    if (error.message.includes('No accounts found')) {
      throw new Error('No accounts found. Please run `brale configure` first.')
    }
    throw error
  }
} 