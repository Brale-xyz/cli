import {expect} from 'chai'
import * as addressUtils from '../../src/lib/address-utils'

const {
  MAINNET_NETWORKS,
  getAddressDisplayName,
  filterMainnetAddresses,
  findCompatibleSourceAddress
} = addressUtils

describe('address-utils', () => {
  describe('MAINNET_NETWORKS', () => {
    it('should contain all expected mainnet networks', () => {
      const expectedNetworks = [
        'ethereum', 'base', 'polygon', 'arbitrum', 'optimism', 
        'avalanche', 'celo', 'solana', 'bnb', 'canton'
      ]
      expect(MAINNET_NETWORKS).to.deep.equal(expectedNetworks)
    })

    it('should not contain testnet networks', () => {
      const testnets = ['fuji', 'sepolia', 'solana_devnet', 'canton_testnet']
      testnets.forEach(testnet => {
        expect(MAINNET_NETWORKS).to.not.include(testnet)
      })
    })
  })

  describe('getAddressDisplayName', () => {
    it('should return the name when available', () => {
      const address = { id: 'addr123', name: 'My Wallet' }
      expect(getAddressDisplayName(address)).to.equal('My Wallet')
    })

    it('should return the id when name is null', () => {
      const address = { id: 'addr123', name: null }
      expect(getAddressDisplayName(address)).to.equal('addr123')
    })

    it('should return the id when name is undefined', () => {
      const address = { id: 'addr123' }
      expect(getAddressDisplayName(address)).to.equal('addr123')
    })
  })

  describe('filterMainnetAddresses', () => {
    const mockAddresses = [
      {
        id: 'addr1',
        type: 'internal',
        transfer_types: ['ethereum', 'base', 'polygon']
      },
      {
        id: 'addr2', 
        type: 'external',
        transfer_types: ['ethereum', 'base']
      },
      {
        id: 'addr3',
        type: 'internal',
        transfer_types: ['fuji', 'sepolia'] // testnets only
      },
      {
        id: 'addr4',
        type: 'internal',
        transfer_types: ['ethereum', 'fuji', 'base'] // mixed
      }
    ]

    it('should filter to internal addresses only', () => {
      const result = filterMainnetAddresses(mockAddresses)
      result.forEach(addr => {
        expect(addr.type).to.equal('internal')
      })
    })

    it('should exclude addresses with only testnet transfer types', () => {
      const result = filterMainnetAddresses(mockAddresses)
      const ids = result.map(addr => addr.id)
      expect(ids).to.not.include('addr3')
    })

    it('should include addresses with at least one mainnet transfer type', () => {
      const result = filterMainnetAddresses(mockAddresses)
      const ids = result.map(addr => addr.id)
      expect(ids).to.include('addr1')
      expect(ids).to.include('addr4')
    })
  })

  describe('findCompatibleSourceAddress', () => {
    const mockAddresses = [
      {
        id: 'addr1',
        type: 'internal',
        transfer_types: ['ethereum', 'base', 'polygon']
      },
      {
        id: 'addr2',
        type: 'external', 
        transfer_types: ['ethereum', 'base']
      },
      {
        id: 'addr3',
        type: 'internal',
        transfer_types: ['solana', 'canton']
      }
    ]

    it('should find compatible internal address for given transfer type', () => {
      const result = findCompatibleSourceAddress(mockAddresses, 'ethereum')
      expect(result).to.not.be.null
      expect(result.id).to.equal('addr1')
      expect(result.type).to.equal('internal')
    })

    it('should return null if no compatible internal address found', () => {
      const result = findCompatibleSourceAddress(mockAddresses, 'avalanche')
      expect(result).to.be.null
    })

    it('should be case insensitive for transfer type matching', () => {
      const result = findCompatibleSourceAddress(mockAddresses, 'ETHEREUM')
      expect(result).to.not.be.null
      expect(result.id).to.equal('addr1')
    })
  })
})
