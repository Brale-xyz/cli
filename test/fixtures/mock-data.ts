export const mockAccountId = '2MnKwXb5Rdua0fskxLceQwcIauv'

export const mockAccounts = {
  accounts: [
    '2MnKwXb5Rdua0fskxLceQwcIauv',
    '2AbCdEfGhIjKlMnOpQrStUvWx'
  ]
}

export const mockAddresses = {
  addresses: [
    {
      id: '2sgZWmeTXpLu1wSnAUWOaGMBtTa',
      type: 'internal',
      name: 'Canton Wallet',
      transfer_types: ['canton'],
      address: 'party-34272510-8f2f-41d0-b354-4044e9d9b086::1220b8301e18aa8a401d6e34e6c20f8b0243183c514373bca8f1b6b9270246341a9e'
    },
    {
      id: '2MnKwiImf1MTX2pA0jY6fkITEYC',
      type: 'internal',
      name: null,
      transfer_types: ['ethereum', 'base', 'polygon', 'arbitrum', 'optimism', 'avalanche', 'celo', 'bnb'],
      address: '0xc8eE12220C1e033F2443A898b870F26ffFC8D3b5'
    },
    {
      id: '2MnKwj2mXLMqEFrZvEr6ePSo123',
      type: 'internal',
      name: null,
      transfer_types: ['solana'],
      address: '5RFvg9uxEpfefD1eC38QokFnEZsvZF9R6PYaHzbj21R'
    },
    {
      id: '2WOgtcIXgXncICYXstBkQgAOILN',
      type: 'external',
      address: '0x26ECe47A7a7DF6692dD11F42C1B465116a7B068d'
    }
  ]
}

export const mockBalances = {
  balances: [
    {
      address_id: '2sgZWmeTXpLu1wSnAUWOaGMBtTa',
      address_name: 'Canton Wallet',
      address: 'party-34272510-8f2f-41d0-b354-4044e9d9b086::1220b8301e18aa8a401d6e34e6c20f8b0243183c514373bca8f1b6b9270246341a9e',
      balance: { value: '31011.69', currency: 'USD' },
      value_type: 'SBC',
      transfer_type: 'canton'
    }
  ]
}

export const mockTransfer = {
  id: '2yv8EFREcoS858ZAOQMDwoimfHO',
  status: 'pending',
  amount: { value: '1', currency: 'USD' },
  value_type: 'SBC',
  transfer_type: 'base',
  source: {
    address_id: '2sgZWmeTXpLu1wSnAUWOaGMBtTa'
  },
  destination: {
    address_id: '2WOgtcIXgXncICYXstBkQgAOILN'
  }
}

export const mockApiConfig = {
  apiHost: 'https://api.brale.xyz',
  authHost: 'https://auth.brale.xyz',
  clientId: 'test-client-id',
  clientSecret: 'test-client-secret'
}
