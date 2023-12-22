import {Args, Flags} from '@oclif/core'

import {redemptionsAPI, tokensAPI} from '../../api'
import {
  CreateRedemptionRequestRelationships,
  DeploymentRelationship,
  ResponseError,
  TokenList,
  TokensApi,
} from '../../gen/api'
import {getToken} from '../../oauth'
import {BaseCommand} from '../base'

export default class Redeem extends BaseCommand<typeof Redeem> {
  static args = {
    ticker: Args.string({char: 't', description: 'The ticker of the token to redeem/burn', required: true}),
  }

  static description = 'Redeem/burn tokens'

  static flags = {
    address: Flags.string({
      char: 'd',
      dependsOn: ['payment'],
      description: 'The ID of the address you want to receive the USDC (if applicable)',
      required: false,
    }),
    amount: Flags.string({char: 'a', description: 'The amount to redeem', required: true}),
    chain: Flags.string({
      char: 'c',
      description: 'The chain ID of the deployment/chain to redeem from',
      required: true,
    }),
    'financial-institution': Flags.string({
      char: 'f',
      dependsOn: ['payment'],
      description: 'The destination financial institution ID',
      required: false,
    }),
    note: Flags.string({char: 'n', description: 'A note to add to the order', required: false}),
    payment: Flags.string({
      char: 'p',
      description: 'Payment',
      options: ['USDC', 'wire'],
      required: false,
    }),
    'payment-chain': Flags.string({
      char: 'q',
      dependsOn: ['payment'],
      description: 'The USDC chain to pay to',
      required: false,
    }),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(Redeem)
    const bearer = await getToken(await this.loadConfig())
    const tokens = await tokensAPI(await this.loadConfig(), bearer)
    const redemptions = await redemptionsAPI(await this.loadConfig(), bearer)
    const tokenList = await tokens.listTokens()
    const token = tokenList.data.find((d) => d.attributes.ticker === args.ticker)

    if (token) {
      const deployments = await tokens.getTokenDeployments({id: token.id})
      const targetDeployment = deployments.data.find((d) => d.attributes.chain.id === flags.chain)
      if (targetDeployment) {
        try {
          const res = await redemptions.redeem({
            createRedemptionRequest: {
              data: {
                attributes: {amount: {currency: 'USD', value: flags.amount}, note: flags.note},
                relationships: await this.getPaymentDetails(flags, tokens, tokenList),
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

  private async extractUsdcDestination(
    flags: {payment: string | undefined; 'payment-chain': string | undefined},
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

  private async getPaymentDetails(
    flags: {
      address: string | undefined
      'financial-institution': string | undefined
      payment: string | undefined
      'payment-chain': string | undefined
    },
    tokens: TokensApi,
    tokenList: TokenList,
  ): Promise<CreateRedemptionRequestRelationships | undefined> {
    if (flags.payment === 'wire' && flags['financial-institution']) {
      return {
        paymentDestination: {
          id: flags['financial-institution'],
          type: 'financial-institution',
        },
      }
    }

    if (flags.payment === 'USDC' && flags['payment-chain'] && flags.address) {
      const usdcDep = await this.extractUsdcDestination(flags, tokens, tokenList)

      return {
        paymentDeployment: usdcDep,
        paymentDestination: {
          id: flags.address,
          type: 'address',
        },
      }
    }

    return undefined
  }
}
