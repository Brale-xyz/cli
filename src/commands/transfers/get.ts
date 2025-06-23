import {Args} from '@oclif/core'

import {getTransfer} from '../../api'
import {getToken} from '../../oauth'
import {BaseCommand} from '../../lib/base'

export default class TransfersGet extends BaseCommand<typeof TransfersGet> {
  static args = {
    accountId: Args.string({description: 'Account ID', required: true}),
    transferId: Args.string({description: 'Transfer ID to retrieve', required: true}),
  }

  static description = 'Get a specific transfer by ID'

  async run(): Promise<void> {
    const {args} = await this.parse(TransfersGet)

    try {
      const config = await this.loadConfig()
      const bearer = await getToken(config)
      const response = await getTransfer(config, args.accountId, args.transferId, bearer)

      this.output(response)
    } catch (error: any) {
      this.log(`Error getting transfer: ${error.message}`)
    }
  }
} 