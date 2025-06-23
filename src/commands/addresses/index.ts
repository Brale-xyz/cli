import {Args} from '@oclif/core'

import {getAddresses, getAccounts} from '../../api'
import {getToken} from '../../oauth'
import {BaseCommand} from '../../lib/base'

export default class Addresses extends BaseCommand<typeof Addresses> {
  static args = {
    accountId: Args.string({description: 'Account ID to get addresses for', required: true}),
  }

  static description = 'List addresses for an account'

  static examples = [
    '$ brale addresses 2MnKwXb5Rdua0fskxLceQwcIauv',
    '$ brale addresses $(brale accounts --raw | head -1) # Use first account automatically'
  ]

  async catch(err: Error & {exitCode?: number}): Promise<any> {
    // Check if this is a missing argument error
    if (err.message.includes('Missing 1 required arg') && err.message.includes('accountId')) {
      this.log('')
      this.log('🔍 Missing Account ID!')
      this.log('======================')
      this.log('')
      this.log('The addresses command requires your account ID. Here\'s how to get it:')
      this.log('')
      this.log('1️⃣  First, get your account ID:')
      this.log('   $ brale accounts')
      this.log('')
      this.log('2️⃣  Then use it with addresses:')
      this.log('   $ brale addresses YOUR_ACCOUNT_ID')
      this.log('')
      this.log('💡 Quick tip: You can also run this one-liner:')
      this.log('   $ brale addresses $(brale accounts --raw | jq -r \'.[0]\')')
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
           this.log(`   $ brale addresses ${accountId}`)
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
    const {args} = await this.parse(Addresses)

    try {
      const config = await this.loadConfig()
      const bearer = await getToken(config)
      const response = await getAddresses(config, args.accountId, bearer)

      const addresses = response.addresses || []
      
      // Separate addresses by type
      const internalAddresses = addresses.filter((addr: any) => addr.type === 'internal')
      const externalAddresses = addresses.filter((addr: any) => addr.type === 'external')

      if (this.flags.raw) {
        // For raw output, maintain original structure but organized
        this.log(JSON.stringify({
          internal: internalAddresses,
          external: externalAddresses,
          total: addresses.length
        }))
        return
      }

      // Display organized output
      this.log('')
      this.log('🏢 INTERNAL ADDRESSES (Brale-managed)')
      this.log('=====================================')
      if (internalAddresses.length > 0) {
        this.output(internalAddresses)
      } else {
        this.log('No internal addresses found.')
      }

      this.log('')
      this.log('👤 EXTERNAL ADDRESSES (User-controlled)')
      this.log('=======================================')
      if (externalAddresses.length > 0) {
        this.output(externalAddresses)
      } else {
        this.log('No external addresses found.')
      }

      this.log('')
      this.log(`📊 SUMMARY: ${internalAddresses.length} internal, ${externalAddresses.length} external (${addresses.length} total)`)
      
    } catch (error: any) {
      this.error(error.message)
    }
  }
}
