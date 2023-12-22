/* eslint-disable new-cap */
import {
  DeploymentDataFromJSON,
  DeploymentList,
  GetTokenDeploymentsRequest,
  InitOverrideFunction,
  TokenDataFromJSON,
  TokenList,
  TokensApi,
} from '../../src/gen/api'

const USDC_ID = '2ZuBMWdUAxgLgI1LRfllUjZ0fzn'

export class TokensApiStub extends TokensApi {
  override getTokenDeployments(
    requestParameters: GetTokenDeploymentsRequest,
    _initOverrides?: InitOverrideFunction | RequestInit | undefined,
  ): Promise<DeploymentList> {
    return Promise.resolve({
      data: (requestParameters.id === USDC_ID ? usdcDeployments : deployments).map((a) => DeploymentDataFromJSON(a)),
      links: {
        self: {
          href: `/tokens/${requestParameters.id}/deployments`,
        },
      },
    })
  }

  override listTokens(_initOverrides?: InitOverrideFunction | RequestInit | undefined): Promise<TokenList> {
    return Promise.resolve({
      data: tokens.map((a) => TokenDataFromJSON(a)),
      links: {
        self: {
          href: '/tokens',
        },
      },
    })
  }
}

export const tokens = [
  {
    attributes: {
      created: new Date('2023-11-09T15:54:55.310Z'),
      name: 'Token A',
      ticker: 'TICK1',
    },
    id: '2Xwfvnq6laRHjE8vcrhh4e3I1cj',
    links: {
      self: {
        href: '/tokens/2Xwfvnq6laRHjE8vcrhh4e3I1cj',
      },
    },
    relationships: {
      deployments: {
        data: [{id: '2ZsCJF9mRPsHknWlxqsmIDcINBg', type: 'deployment'}],
        links: {related: {href: '/tokens/2Xwfvnq6laRHjE8vcrhh4e3I1cj/deployments'}},
      },
    },
    type: 'token',
  },
  {
    attributes: {
      created: new Date('2023-12-06T18:02:21.553Z'),
      name: 'Token B',
      ticker: 'TICK2',
    },
    id: '2ZBBlNzESY66KG9m01NNnpiQzSe',
    links: {
      self: {
        href: '/tokens/2ZBBlNzESY66KG9m01NNnpiQzSe',
      },
    },
    relationships: {
      deployments: {
        data: [{id: '2ZsCK0Gc2AHwVO2xHVdq3wvVuyk', type: 'deployment'}],
        links: {related: {href: '/tokens/2ZBBlNzESY66KG9m01NNnpiQzSe/deployments'}},
      },
    },
    type: 'token',
  },
  {
    attributes: {
      created: new Date('2023-11-09T15:54:55.310Z'),
      name: 'USD Coin',
      ticker: 'USDC',
    },
    id: USDC_ID,
    links: {
      self: {
        href: `/tokens/${USDC_ID}`,
      },
    },
    relationships: {
      deployments: {
        data: [{id: '2ZsCJF9mRPsHknWlxqsmIDcINBg', type: 'deployment'}],
        links: {related: {href: `/tokens/${USDC_ID}/deployments`}},
      },
    },
    type: 'token',
  },
]

export const deployments = [
  {
    attributes: {
      address: '0x9Fc410A8db3674e85A3Cf86E2C5C01382Ded6339',
      chain: {id: 'avalanche', name: 'Avalanche', networkType: 'mainnet'},
      created: '2023-03-07T21:35:53.654Z',
    },
    id: '2Mhfu3ucOsteVVvzxPYHfmU7W9i',
    links: {
      explorer: {href: 'https://mainnet.avascan.info/blockchain/c/token/0x9Fc410A8db3674e85A3Cf86E2C5C01382Ded6339'},
      self: {href: '/deployments/2Mhfu3ucOsteVVvzxPYHfmU7W9i'},
    },
    type: 'deployment',
  },
  {
    attributes: {
      address: '0x6518A0C7CE45470Ff93Df858fF9F930eEAd5dbcC',
      chain: {id: 'polygon', name: 'Polygon', networkType: 'mainnet'},
      created: '2023-03-08T23:34:41.931Z',
    },
    id: '2MkjTOTcj9uAbkhBjMzXDFy2MRe',
    links: {
      explorer: {href: 'https://polygonscan.com/token/0x6518A0C7CE45470Ff93Df858fF9F930eEAd5dbcC'},
      self: {href: '/deployments/2MkjTOTcj9uAbkhBjMzXDFy2MRe'},
    },
    type: 'deployment',
  },
  {
    attributes: {
      address: '0xeCc63359BA28EaDE0349C7270AB0dB34Bf8357B1',
      chain: {id: 'celo', name: 'Celo', networkType: 'mainnet'},
      created: '2023-07-05T13:56:34.563Z',
    },
    id: '2S9irJF0LKYAqtHo5lzkKVh3VCj',
    links: {
      explorer: {href: 'https://celoscan.io/token/0xeCc63359BA28EaDE0349C7270AB0dB34Bf8357B1'},
      self: {href: '/deployments/2S9irJF0LKYAqtHo5lzkKVh3VCj'},
    },
    type: 'deployment',
  },
  {
    attributes: {
      address: 'DNajSzD3zXXEpYemaWP6ckRXRZmH2y33bUGsqEqgf8VA',
      chain: {id: 'solana', name: 'Solana', networkType: 'mainnet'},
      created: '2023-11-01T20:19:24.917Z',
    },
    id: '2Xab6oilx62rf2v9dgIfWqcTwX8',
    links: {
      explorer: {
        href: 'https://explorer.solana.com/address/DNajSzD3zXXEpYemaWP6ckRXRZmH2y33bUGsqEqgf8VA?cluster=devnet',
      },
      self: {href: '/deployments/2Xab6oilx62rf2v9dgIfWqcTwX8'},
    },
    type: 'deployment',
  },
]

export const usdcDeployments = [
  {
    attributes: {
      address: '0x0601E4A7f7aB28bbBC97198e6013124fEc8e3FE3',
      chain: {id: 'ethereum', name: 'Ethereum', networkType: 'mainnet'},
      created: '2023-03-07T21:35:53.654Z',
    },
    id: '2ZuBRUPaNqOBOCX1NrEzqrW6267',
    links: {
      explorer: {href: 'https://etherscan.io/'},
      self: {href: '/deployments/2ZuBRUPaNqOBOCX1NrEzqrW6267'},
    },
    type: 'deployment',
  },
]
