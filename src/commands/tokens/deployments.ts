import {Args, Flags} from '@oclif/core'

import {tokensAPI} from '../../api'
import {DeploymentData} from '../../gen/api'
import {BaseCommand} from '../base'

export default class Deployments extends BaseCommand<typeof Deployments> {
  static args = {
    ticker: Args.string({description: 'The ticker of the token to get deployments for', required: true}),
  }

  static description = 'List addresses'

  static flags = {
    chain: Flags.string({char: 'c', description: 'The chain id to filter by', required: false}),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(Deployments)

    const tokens = await tokensAPI(await this.loadConfig())
    const t = await tokens.listTokens()

    const token = t.data.find((d) => d.attributes.ticker === args.ticker)

    if (token) {
      const deployments = await tokens.getTokenDeployments({id: token.id})
      if (flags.chain) {
        const d = deployments.data.find((d) => d.attributes.chain.id === flags.chain)
        this.output(d, this.format)
      } else {
        this.output(deployments.data, this.format)
      }
    } else {
      this.error(`Couldn't find token for ticker: ${args.ticker}`)
    }
  }

  private format(d: DeploymentData) {
    return {
      chain: d.attributes.chain.id,
    }
  }
}
