import {Args, Flags} from '@oclif/core'

import {createTransfer} from '../../api'
import {getToken} from '../../oauth'
import {BaseCommand} from '../../lib/base'

export default class TransfersCreate extends BaseCommand<typeof TransfersCreate> {
  static args = {
    accountId: Args.string({description: 'Account ID to create transfer for', required: true}),
  }

  static description = 'Create a new transfer (onramp, offramp, swap, or payout)'

  static examples = [
    '<%= config.bin %> <%= command.id %> 2Js1YFqlfxgNqC2KTPEjrWIwKU7 --amount 100 --currency USD --source-type USD --source-transfer-type wire --dest-type SBC --dest-transfer-type base --dest-address-id 2MhCCIHulVdXrHiEuQDJvnKbSkl',
  ]

  static flags = {
    amount: Flags.string({char: 'a', description: 'Amount to transfer', required: true}),
    currency: Flags.string({char: 'c', description: 'Currency (USD, USDC, etc.)', required: true}),
    'source-type': Flags.string({description: 'Source value type (USD, USDC, SBC, etc.)', required: true}),
    'source-transfer-type': Flags.string({description: 'Source transfer type (wire, ach, polygon, solana, etc.)', required: true}),
    'dest-type': Flags.string({description: 'Destination value type (USD, USDC, SBC, etc.)', required: true}),
    'dest-transfer-type': Flags.string({description: 'Destination transfer type (wire, ach, polygon, solana, etc.)', required: true}),
    'dest-address-id': Flags.string({description: 'Destination address ID (for stablecoin destinations)', required: false}),
    'source-address-id': Flags.string({description: 'Source address ID (for stablecoin sources)', required: false}),
    'dest-fi-id': Flags.string({description: 'Destination financial institution ID (for fiat destinations)', required: false}),
    'source-fi-id': Flags.string({description: 'Source financial institution ID (for fiat sources)', required: false}),
    note: Flags.string({char: 'n', description: 'Transfer note', required: false}),
    memo: Flags.string({char: 'm', description: 'Transfer memo', required: false}),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(TransfersCreate)

    try {
      const config = await this.loadConfig()
      const bearer = await getToken(config)

      const transferData = {
        amount: { 
          value: flags.amount, 
          currency: flags.currency 
        },
        source: {
          value_type: flags['source-type'],
          transfer_type: flags['source-transfer-type'],
          ...(flags['source-address-id'] && { address_id: flags['source-address-id'] }),
          ...(flags['source-fi-id'] && { financial_institution_id: flags['source-fi-id'] })
        },
        destination: {
          value_type: flags['dest-type'],
          transfer_type: flags['dest-transfer-type'],
          ...(flags['dest-address-id'] && { address_id: flags['dest-address-id'] }),
          ...(flags['dest-fi-id'] && { financial_institution_id: flags['dest-fi-id'] }),
          ...(flags.memo && { memo: flags.memo })
        },
        ...(flags.note && { note: flags.note })
      }

      const response = await createTransfer(config, args.accountId, transferData, bearer)
      this.output(response)
    } catch (error: any) {
      this.log(`Error creating transfer: ${error.message}`)
    }
  }
} 