import {getAccounts} from '../api'
import {getToken} from '../oauth'
import {BaseCommand} from '../lib/base'

export default class Accounts extends BaseCommand<typeof Accounts> {
  static description = 'List your accounts'

  async run(): Promise<void> {
    try {
      const config = await this.loadConfig()
      const bearer = await getToken(config)
      const response = await getAccounts(config, bearer)

      this.output(response.accounts)
    } catch (error: any) {
      this.error(error.message)
    }
  }
} 