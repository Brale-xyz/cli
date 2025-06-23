import {Args} from '@oclif/core'

import {getTransfers} from '../../api'
import {getToken} from '../../oauth'
import {BaseCommand} from '../../lib/base'

export default class TransfersList extends BaseCommand<typeof TransfersList> {
  static args = {
    accountId: Args.string({description: 'Account ID to list transfers for', required: true}),
  }

  static description = 'List transfers for an account'

  async run(): Promise<void> {
    const {args} = await this.parse(TransfersList)

    try {
      const config = await this.loadConfig()
      const bearer = await getToken(config)
      const response = await getTransfers(config, args.accountId, bearer)

      this.output(response.transfers || [])
    } catch (error: any) {
      this.log(`Error listing transfers: ${error.message}`)
    }
  }
} 