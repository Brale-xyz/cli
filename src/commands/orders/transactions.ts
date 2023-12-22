import {Args} from '@oclif/core'

import {ordersAPI} from '../../api'
import {TransactionData} from '../../gen/api'
import {BaseCommand} from '../base'

export default class OrderTransactions extends BaseCommand<typeof OrderTransactions> {
  static args = {
    id: Args.string({description: 'The id of the Order', required: true}),
  }

  static description = "Get an order's transactions"

  async run(): Promise<void> {
    const {args} = await this.parse(OrderTransactions)

    const orders = await ordersAPI(await this.loadConfig())
    const tx = await orders.getOrderTransactions({id: args.id})

    this.output(tx.data, this.format)
  }

  private format(d: TransactionData) {
    return {
      amount: `$${d.attributes.amount?.value}`,
    }
  }
}
