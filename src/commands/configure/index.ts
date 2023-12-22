import {Flags} from '@oclif/core'
import * as fs from 'node:fs/promises'

import {ApiConfiguration} from '../../api'
import {BaseCommand} from '../base'

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
      required: true,
    }),
    'client-secret': Flags.string({
      char: 's',
      description: 'API Client Secret',
      required: true,
    }),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(Configure)

    if (!(await this.exists(this.config.configDir))) {
      await fs.mkdir(this.config.configDir)
    }

    try {
      const c = await this.loadConfig()
      c.clientId = flags['client-id']
      c.clientSecret = flags['client-secret']
      if (flags['api-host']) {
        c.apiHost = flags['api-host']
      }

      if (flags['auth-host']) {
        c.authHost = flags['auth-host']
      }

      await this.saveConfig(this.configFilePath(), JSON.stringify(c))
    } catch {
      // Config hasn't been initialized.
      this.log('Intializing config for the first time.')

      const c: ApiConfiguration = {
        apiHost: flags['api-host'] || 'https://api.brale.xyz',
        authHost: flags['auth-host'] || 'https://auth.brale.xyz',
        clientId: flags['client-id'],
        clientSecret: flags['client-secret'],
      }

      await this.saveConfig(this.configFilePath(), JSON.stringify(c))
    }

    this.log('Successfully saved API configuration.')
  }

  private async saveConfig(filePath: string, conf: string) {
    fs.writeFile(filePath, Buffer.from(conf))
  }
}
