import {InitOverrideFunction, MintRequest, MintsApi, Order, OrderData} from '../../src/gen/api'

export class MintsApiStub extends MintsApi {
  private _submittedReq: MintRequest | undefined = undefined

  public get submittedReq(): MintRequest | undefined {
    return this._submittedReq
  }

  protected set submittedReq(value: MintRequest) {
    this._submittedReq = value
  }

  override mint(
    requestParameters: MintRequest,
    _initOverrides?: InitOverrideFunction | RequestInit | undefined,
  ): Promise<Order> {
    this.submittedReq = requestParameters
    return Promise.resolve({
      data: mintOrder,
      links: {
        self: {
          href: `/orders/2Zb6l3RXgPbZ6wPaQRdP2bRIg8n`,
        },
      },
    })
  }
}

export const mintOrder: OrderData = {
  attributes: {
    created: new Date('2023-12-15T22:16:18.807Z'),
    status: 'pending',
    type: 'mint',
    updated: new Date('2023-12-15T22:16:18.807Z'),
  },
  id: '2Zb6l3RXgPbZ6wPaQRdP2bRIg8n',
  relationships: {
    transactions: {
      data: null,
      links: {
        related: {
          href: '/orders/2Zb6l3RXgPbZ6wPaQRdP2bRIg8n/transactions',
        },
      },
    },
  },
  type: 'order',
}
