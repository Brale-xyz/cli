import {Flags} from '@oclif/core'
import * as fs from 'node:fs/promises'
import {stdin as input, stdout as output} from 'node:process'
import * as readline from 'node:readline/promises'

import {ApiConfiguration} from '../../api'
import {BaseCommand} from '../../lib/base'

export default class Configure extends BaseCommand<typeof Configure> {
  static description = 'Configure API credentials'

  static flags = {
    'api-host': Flags.string({
      char: 'h',
      description: 'API Host',
      required: false,
    }),
    'auth-host': Flags.string({
      char: 'a',
      description: 'Token Auth Host',
      required: false,
    }),
    'client-id': Flags.string({
      char: 'i',
      description: 'API Client ID',
      required: false,
    }),
    'client-secret': Flags.string({
      char: 's',
      description: 'API Client Secret',
      required: false,
    }),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(Configure)

    this.log('🔧 Brale CLI Configuration Setup')
    this.log('================================')
    this.log('')

    // Get client ID
    let clientId = flags['client-id']
    if (!clientId) {
      const rl = readline.createInterface({input, output})
      clientId = await rl.question('Enter your Brale API Client ID: ')
      rl.close()
      
      if (!clientId.trim()) {
        this.error('Client ID is required')
      }
    }

    // Get client secret
    let clientSecret = flags['client-secret']
    if (!clientSecret) {
      const rl = readline.createInterface({input, output})
      // Note: readline doesn't have built-in password masking, but we can provide a warning
      this.log('⚠️  Your client secret will be visible as you type')
      clientSecret = await rl.question('Enter your Brale API Client Secret: ')
      rl.close()
      
      if (!clientSecret.trim()) {
        this.error('Client Secret is required')
      }
    }

    if (!(await this.exists(this.config.configDir))) {
      await fs.mkdir(this.config.configDir, { recursive: true })
    }

    try {
      const c = await this.loadConfig()
      c.clientId = clientId.trim()
      c.clientSecret = clientSecret.trim()
      if (flags['api-host']) {
        c.apiHost = flags['api-host']
      }

      if (flags['auth-host']) {
        c.authHost = flags['auth-host']
      }

      await this.saveConfig(this.configFilePath(), JSON.stringify(c))
    } catch {
      // Config hasn't been initialized.
      this.log('')
      this.log('🆕 Initializing configuration for the first time...')

      const c: ApiConfiguration = {
        apiHost: flags['api-host'] || 'https://api.brale.xyz',
        authHost: flags['auth-host'] || 'https://auth.brale.xyz',
        clientId: clientId.trim(),
        clientSecret: clientSecret.trim(),
      }

      await this.saveConfig(this.configFilePath(), JSON.stringify(c))
    }

    this.log('')
    this.log('✅ Successfully saved API configuration!')
    this.log('')
    this.log('🚀 You can now use commands like:')
    this.log('   brale accounts')
    this.log('   brale balances ACCOUNT_ID')
    this.log('   brale transfers create ACCOUNT_ID ...')
    this.log('')
    this.log('💡 Run "brale --help" to see all available commands')
  }

  private async saveConfig(filePath: string, conf: string) {
    fs.writeFile(filePath, conf)
  }
}
