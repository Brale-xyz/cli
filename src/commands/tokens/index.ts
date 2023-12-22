import {Flags} from '@oclif/core'

import {tokensAPI} from '../../api'
import {BaseCommand} from '../base'

export default class Tokens extends BaseCommand<typeof Tokens> {
  static description = 'List addresses'

  static flags = {
    ticker: Flags.string({char: 't', description: 'The ticker to filter by', required: false}),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(Tokens)

    const tokens = await tokensAPI(await this.loadConfig())
    const t = await tokens.listTokens()

    if (flags.ticker) {
      const token = t.data.find((d) => d.attributes.ticker === flags.ticker)
      this.output(token)
    } else {
      this.output(t.data)
    }
  }
}
