import {Args} from '@oclif/core'

import {getBalances, getAccounts} from '../api'
import {getToken} from '../oauth'
import {BaseCommand} from '../lib/base'

export default class Balances extends BaseCommand<typeof Balances> {
  static args = {
    accountId: Args.string({description: 'Account ID to get balances for', required: true}),
  }

  static description = 'List balances for an account'

  static examples = [
    '$ brale balances 2MnKwXb5Rdua0fskxLceQwcIauv',
    '$ brale balances $(brale accounts --raw | head -1) # Use first account automatically'
  ]

  async catch(err: Error & {exitCode?: number}): Promise<any> {
    // Check if this is a missing argument error
    if (err.message.includes('Missing 1 required arg') && err.message.includes('accountId')) {
      this.log('')
      this.log('🔍 Missing Account ID!')
      this.log('======================')
      this.log('')
      this.log('The balances command requires your account ID. Here\'s how to get it:')
      this.log('')
      this.log('1️⃣  First, get your account ID:')
      this.log('   $ brale accounts')
      this.log('')
      this.log('2️⃣  Then use it with balances:')
      this.log('   $ brale balances YOUR_ACCOUNT_ID')
      this.log('')
      
             // Try to help by showing their account ID if possible
       try {
         const config = await this.loadConfig()
         const bearer = await getToken(config)
         const accountsResponse = await getAccounts(config, bearer)
         const accounts = accountsResponse.accounts || []
         
         if (accounts.length > 0) {
           const accountId = typeof accounts[0] === 'string' ? accounts[0] : accounts[0].id
           this.log('🎯 Found your account ID:')
           this.log(`   Account ID: ${accountId}`)
           this.log('')
           this.log('📋 Copy and run this command:')
           this.log(`   $ brale balances ${accountId}`)
           this.log('')
         }
      } catch (configError) {
        this.log('⚠️  Note: Run "brale configure" first if you haven\'t set up your API credentials.')
        this.log('')
      }
      
      this.exit(1)
    }
    
    // For other errors, use default handling
    return super.catch(err)
  }

  async run(): Promise<void> {
    const {args} = await this.parse(Balances)

    try {
      const config = await this.loadConfig()
      const bearer = await getToken(config)
      const response = await getBalances(config, args.accountId, bearer)

      this.output(response.balances)
    } catch (error: any) {
      this.error(error.message)
    }
  }
} 