import {expect} from 'chai'
import {
  formatBalance,
  formatBalances,
  hasPositiveBalance,
  sumBalancesByCurrency
} from '../../src/lib/balance-utils'

describe('balance-utils', () => {
  describe('formatBalance', () => {
    it('should format large balances with commas', () => {
      expect(formatBalance('31011.69', 'SBC')).to.equal('31,011.69 SBC')
      expect(formatBalance('1000000.50', 'USDC')).to.equal('1,000,000.5 USDC')
    })

    it('should format regular balances with 2 decimal places', () => {
      expect(formatBalance('100.123456', 'SBC')).to.equal('100.12 SBC')
      expect(formatBalance('50.5', 'USDC')).to.equal('50.50 USDC')
    })

    it('should format small balances with 6 decimal places', () => {
      expect(formatBalance('0.123456', 'SBC')).to.equal('0.123456 SBC')
      expect(formatBalance('0.000001', 'USDC')).to.equal('0.000001 USDC')
    })

    it('should return "0" for zero balances', () => {
      expect(formatBalance('0', 'SBC')).to.equal('0')
      expect(formatBalance('0.00', 'USDC')).to.equal('0')
    })
  })

  describe('formatBalances', () => {
    it('should format multiple balances correctly', () => {
      const balances = [
        { value: '100.50', value_type: 'SBC' },
        { value: '50.25', value_type: 'USDC' }
      ]
      expect(formatBalances(balances)).to.equal('100.50 SBC, 50.25 USDC')
    })

    it('should return "0" for empty balances array', () => {
      expect(formatBalances([])).to.equal('0')
    })

    it('should handle single balance', () => {
      const balances = [{ value: '31011.69', value_type: 'SBC' }]
      expect(formatBalances(balances)).to.equal('31,011.69 SBC')
    })
  })

  describe('hasPositiveBalance', () => {
    it('should return true for positive balances', () => {
      expect(hasPositiveBalance({ value: '100.50' })).to.be.true
      expect(hasPositiveBalance({ value: '0.01' })).to.be.true
    })

    it('should return false for zero balances', () => {
      expect(hasPositiveBalance({ value: '0' })).to.be.false
      expect(hasPositiveBalance({ value: '0.00' })).to.be.false
    })
  })

  describe('sumBalancesByCurrency', () => {
    it('should sum balances by currency type', () => {
      const balances = [
        { value: '100', value_type: 'SBC' },
        { value: '50', value_type: 'SBC' },
        { value: '25', value_type: 'USDC' }
      ]
      const result = sumBalancesByCurrency(balances)
      
      expect(result).to.have.length(2)
      expect(result.find(b => b.value_type === 'SBC')?.value).to.equal('150')
      expect(result.find(b => b.value_type === 'USDC')?.value).to.equal('25')
    })

    it('should handle empty balances array', () => {
      expect(sumBalancesByCurrency([])).to.deep.equal([])
    })
  })
})
