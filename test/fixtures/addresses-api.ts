/* eslint-disable new-cap */
import {
  AddressData,
  AddressDataFromJSON,
  AddressList,
  AddressListFromJSON,
  AddressesApi,
  InitOverrideFunction,
} from '../../src/gen/api'

export class AddressesApiStub extends AddressesApi {
  override listAddresses(_initOverrides?: InitOverrideFunction | RequestInit | undefined): Promise<AddressList> {
    const a = addresses.map((a) => AddressDataFromJSON(a))

    return Promise.resolve(
      AddressListFromJSON({
        data: a,
        links: {
          self: {
            href: '/addresses',
          },
        },
      }),
    )
  }
}

export const addresses: Array<AddressData> = [
  {
    attributes: {
      address: '0xD4Bc64E31c8F216B07F0156B76FC06Da94b73d26',
      created: new Date('2023-11-09T15:54:55.310Z'),
      name: 'Dev EOA',
      status: 'active',
      supportedChains: [
        {
          id: 'avalanche',
          name: 'Avalanche',
          networkType: 'mainnet',
        },
        {
          id: 'ethereum',
          name: 'Ethereum',
          networkType: 'mainnet',
        },
        {
          id: 'fuji',
          name: 'Fuji',
          networkType: 'testnet',
        },
        {
          id: 'sepolia',
          name: 'Sepolia',
          networkType: 'testnet',
        },
        {
          id: 'alfajores',
          name: 'Alfajores',
          networkType: 'testnet',
        },
        {
          id: 'celo',
          name: 'Celo',
          networkType: 'mainnet',
        },
        {
          id: 'base',
          name: 'Base',
          networkType: 'mainnet',
        },
        {
          id: 'optimism',
          name: 'Optimism',
          networkType: 'mainnet',
        },
        {
          id: 'mumbai',
          name: 'Mumbai',
          networkType: 'testnet',
        },
        {
          id: 'polygon',
          name: 'Polygon',
          networkType: 'mainnet',
        },
        {
          id: 'arbitrum',
          name: 'Arbitrum',
          networkType: 'mainnet',
        },
      ],
      type: 'externally-owned',
    },
    id: '2Xwfvnq6laRHjE8vcrhh4e3I1cj',
    links: {
      self: {
        href: '/addresses/2Xwfvnq6laRHjE8vcrhh4e3I1cj',
      },
    },
    type: 'address',
  },
  {
    attributes: {
      address: 'GA6ND36OI5DPG6WSWYQBPIXKWEGOO3FDGTA5RLY264LM42ZAK2JRIG6S',
      created: new Date('2023-12-06T18:02:21.553Z'),
      status: 'active',
      supportedChains: [
        {
          id: 'stellar',
          name: 'Stellar',
          networkType: 'mainnet',
        },
        {
          id: 'stellar_testnet',
          name: 'Stellar Testnet',
          networkType: 'testnet',
        },
      ],
      type: 'custodial',
    },
    id: '2ZBBlNzESY66KG9m01NNnpiQzSe',
    links: {
      self: {
        href: '/addresses/2ZBBlNzESY66KG9m01NNnpiQzSe',
      },
    },
    type: 'address',
  },
  {
    attributes: {
      address: '73uyt9HkEqx9bThYXWaUBP67sWsiJEsyJ5rSCieDx5me',
      created: new Date('2023-12-21T16:03:00.561Z'),
      name: 'Test Phantom',
      status: 'active',
      supportedChains: [
        {
          id: 'solana',
          name: 'Solana',
          networkType: 'mainnet',
        },
        {
          id: 'solana_devnet',
          name: 'Solana Devnet',
          networkType: 'testnet',
        },
      ],
      type: 'externally-owned',
    },
    id: '2ZrK6GePZ38dT5dBkKNhJM4n9S6',
    links: {
      self: {
        href: '/addresses/2ZrK6GePZ38dT5dBkKNhJM4n9S6',
      },
    },
    type: 'address',
  },
]
