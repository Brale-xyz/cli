import {Args, Flags} from '@oclif/core'

import {mintsAPI, tokensAPI} from '../../api'
import {DeploymentRelationship, ResponseError, TokenList, TokensApi} from '../../gen/api'
import {getToken} from '../../oauth'
import {BaseCommand} from '../base'

export default class Mint extends BaseCommand<typeof Mint> {
  static args = {
    ticker: Args.string({char: 't', description: 'The ticker of the token to mint', required: true}),
  }

  static description = 'Mint tokens'

  static flags = {
    amount: Flags.string({char: 'a', description: 'The amount to mint', required: true}),
    chain: Flags.string({char: 'c', description: 'The chain ID of the deployment/chain to mint on', required: true}),
    destination: Flags.string({char: 'd', description: 'The destination address ID', required: true}),
    note: Flags.string({char: 'n', description: 'A note to add to the order', required: false}),
    payment: Flags.string({
      char: 'p',
      default: 'wire',
      description: 'Payment',
      options: ['USDC', 'wire'],
      required: false,
    }),
    'payment-chain': Flags.string({
      char: 'q',
      dependsOn: ['payment'],
      description: 'The USDC chain to pay from',
      required: false,
    }),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(Mint)

    const bearer = await getToken(await this.loadConfig())
    const tokens = await tokensAPI(await this.loadConfig(), bearer)
    const mints = await mintsAPI(await this.loadConfig(), bearer)
    const tokenList = await tokens.listTokens()
    const token = tokenList.data.find((t) => t.attributes.ticker === args.ticker)

    if (token) {
      const deployments = await tokens.getTokenDeployments({id: token.id})
      const targetDeployment = deployments.data.find((d) => d.attributes.chain.id === flags.chain)

      if (targetDeployment) {
        try {
          const res = await mints.mint({
            createMintRequest: {
              data: {
                attributes: {amount: {currency: 'USD', value: flags.amount}, note: flags.note},
                relationships: {
                  destination: {
                    id: flags.destination,
                    type: 'address',
                  },
                  fundingDeployment: await this.extractUsdcPayment(flags, tokens, tokenList),
                },
                type: 'order',
              },
            },
            id: targetDeployment.id,
          })

          this.output(res.data)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          if (error instanceof ResponseError && error.response.body) {
            const b = await error.response.json()

            console.error(b)
          } else {
            this.error(error)
          }
        }
      } else {
        this.error(`Couldn't find a deployment for chain: ${flags.chain}`)
      }
    } else {
      this.error(`Couldn't find token for ticker: ${args.ticker}`)
    }
  }

  private async extractUsdcPayment(
    flags: {payment: string; 'payment-chain': string | undefined},
    tokens: TokensApi,
    tokenList: TokenList,
  ): Promise<DeploymentRelationship | undefined> {
    if (flags.payment === 'USDC' && flags['payment-chain']) {
      const usdc = tokenList.data.find((t) => t.attributes.ticker === 'USDC')
      if (usdc) {
        const usdcDeployments = await tokens.getTokenDeployments({id: usdc.id})
        const dep = usdcDeployments.data.find((d) => d.attributes.chain.id === flags['payment-chain'])

        if (dep) {
          return {
            id: dep?.id,
            type: 'deployment',
          }
        }

        throw new Error(`Could not find USDC deployment for chain: ${flags['payment-chain']}`)
      }
    }

    return undefined
  }
}
