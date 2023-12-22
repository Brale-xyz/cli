import {InitOverrideFunction, Order, OrderData, RedeemRequest, RedemptionsApi} from '../../src/gen/api'

export class RedemptionsApiStub extends RedemptionsApi {
  private _submittedReq: RedeemRequest | undefined = undefined

  public get submittedReq(): RedeemRequest | undefined {
    return this._submittedReq
  }

  protected set submittedReq(value: RedeemRequest) {
    this._submittedReq = value
  }

  override redeem(
    requestParameters: RedeemRequest,
    _initOverrides?: InitOverrideFunction | RequestInit | undefined,
  ): Promise<Order> {
    this.submittedReq = requestParameters
    return Promise.resolve({
      data: redeemOrder,
      links: {
        self: {
          href: `/orders/2Zb6l3RXgPbZ6wPaQRdP2bRIg8n`,
        },
      },
    })
  }
}

export const redeemOrder: OrderData = {
  attributes: {
    created: new Date('2023-12-15T22:16:18.807Z'),
    status: 'pending',
    type: 'redemption',
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
