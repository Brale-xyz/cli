import {Args} from '@oclif/core'

import {ordersAPI} from '../../api'
import {BaseCommand} from '../base'

export default class Get extends BaseCommand<typeof Get> {
  static args = {
    id: Args.string({description: 'The id of the Order', required: true}),
  }

  static description = 'Get order'

  async run(): Promise<void> {
    const {args} = await this.parse(Get)

    const orders = await ordersAPI(await this.loadConfig())
    const order = await orders.getOrder({id: args.id})

    this.output(order.data)
  }
}
