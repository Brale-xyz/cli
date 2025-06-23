/**
 * Format balance value with currency
 */
export function formatBalance(value: string, currency: string): string {
  const numValue = parseFloat(value)
  if (numValue === 0) return '0'
  
  // Format with appropriate decimal places
  if (numValue >= 1000) {
    return `${numValue.toLocaleString()} ${currency}`
  } else if (numValue >= 1) {
    return `${numValue.toFixed(2)} ${currency}`
  } else {
    return `${numValue.toFixed(6)} ${currency}`
  }
}

/**
 * Format multiple balances into a single string
 */
export function formatBalances(balances: Array<{value: string, value_type: string}>): string {
  if (balances.length === 0) return '0'
  
  return balances
    .map(b => formatBalance(b.value, b.value_type))
    .join(', ')
}

/**
 * Check if balance has a positive value
 */
export function hasPositiveBalance(balance: {value: string}): boolean {
  return parseFloat(balance.value) > 0
}

/**
 * Sum balances of the same currency
 */
export function sumBalancesByCurrency(balances: Array<{value: string, value_type: string}>): Array<{value: string, value_type: string}> {
  const sums = new Map<string, number>()
  
  for (const balance of balances) {
    const current = sums.get(balance.value_type) || 0
    sums.set(balance.value_type, current + parseFloat(balance.value))
  }
  
  return Array.from(sums.entries()).map(([currency, value]) => ({
    value: value.toString(),
    value_type: currency
  }))
} 