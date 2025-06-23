import {expect} from 'chai'
import {stub, SinonStub} from 'sinon'
import {
  discoverAccount,
  isValidAccountId,
  getAccountWithErrorHandling
} from '../../src/lib/account-utils'
import * as api from '../../src/api'

describe('account-utils', () => {
  describe('isValidAccountId', () => {
    it('should validate correct account ID formats', () => {
      expect(isValidAccountId('2MnKwXb5Rdua0fskxLceQwcIauv')).to.be.true
      expect(isValidAccountId('AbCdEfGhIjKlMnOpQrStUvWxYz123')).to.be.true
    })

    it('should reject invalid account ID formats', () => {
      expect(isValidAccountId('short')).to.be.false
      expect(isValidAccountId('toolongaccountidthatexceedslimit123456789')).to.be.false
      expect(isValidAccountId('invalid-chars!')).to.be.false
      expect(isValidAccountId('')).to.be.false
    })
  })

  describe('discoverAccount', () => {
    let getAccountsStub: SinonStub

    beforeEach(() => {
      getAccountsStub = stub(api, 'getAccounts')
    })

    afterEach(() => {
      getAccountsStub.restore()
    })

    it('should return first account when accounts exist', async () => {
      getAccountsStub.resolves({ accounts: ['account1', 'account2'] })
      
      const config = { apiHost: 'test', authHost: 'test', clientId: 'test', clientSecret: 'test' }
      const result = await discoverAccount(config, 'token')
      
      expect(result).to.equal('account1')
    })

    it('should throw error when no accounts exist', async () => {
      getAccountsStub.resolves({ accounts: [] })
      
      const config = { apiHost: 'test', authHost: 'test', clientId: 'test', clientSecret: 'test' }
      
      try {
        await discoverAccount(config, 'token')
        expect.fail('Should have thrown an error')
      } catch (error: any) {
        expect(error.message).to.include('No accounts found')
      }
    })
  })

  describe('getAccountWithErrorHandling', () => {
    let getAccountsStub: SinonStub

    beforeEach(() => {
      getAccountsStub = stub(api, 'getAccounts')
    })

    afterEach(() => {
      getAccountsStub.restore()
    })

    it('should return provided account ID if valid', async () => {
      const config = { apiHost: 'test', authHost: 'test', clientId: 'test', clientSecret: 'test' }
      const accountId = '2MnKwXb5Rdua0fskxLceQwcIauv'
      
      const result = await getAccountWithErrorHandling(config, accountId, 'token')
      expect(result).to.equal(accountId)
    })

    it('should throw error for invalid account ID format', async () => {
      const config = { apiHost: 'test', authHost: 'test', clientId: 'test', clientSecret: 'test' }
      
      try {
        await getAccountWithErrorHandling(config, 'invalid', 'token')
        expect.fail('Should have thrown an error')
      } catch (error: any) {
        expect(error.message).to.include('Invalid account ID format')
      }
    })

    it('should auto-discover account if none provided', async () => {
      getAccountsStub.resolves({ accounts: ['auto-discovered-account'] })
      
      const config = { apiHost: 'test', authHost: 'test', clientId: 'test', clientSecret: 'test' }
      const result = await getAccountWithErrorHandling(config, undefined, 'token')
      
      expect(result).to.equal('auto-discovered-account')
    })
  })
})
