/* eslint-disable new-cap */
import {
  GetOrderRequest,
  GetOrderTransactionsRequest,
  InitOverrideFunction,
  Order,
  OrderData,
  OrderFromJSON,
  OrdersApi,
  TransactionData,
  TransactionDataFromJSON,
  TransactionList,
  TransactionListFromJSON,
} from '../../src/gen/api'

export class OrdersApiStub extends OrdersApi {
  override getOrder(
    _requestParameters: GetOrderRequest,
    _initOverrides?: InitOverrideFunction | RequestInit | undefined,
  ): Promise<Order> {
    return Promise.resolve(
      OrderFromJSON({
        data: orders[0],
        links: {
          self: {
            href: `/orders/${orders[0].id}`,
          },
        },
      }),
    )
  }

  override getOrderTransactions(
    requestParameters: GetOrderTransactionsRequest,
    _initOverrides?: RequestInit | undefined,
  ): Promise<TransactionList> {
    return Promise.resolve(
      TransactionListFromJSON({
        data: transactions.map((t) => TransactionDataFromJSON(t)),
        links: {
          self: {
            href: `/orders/${requestParameters.id}/transactions`,
          },
        },
      }),
    )
  }
}

export const orders: Array<OrderData> = [
  {
    attributes: {
      created: new Date('2023-12-15T22:16:18.807Z'),
      status: 'complete',
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
  },
]

export const transactions: Array<TransactionData> = [
  {
    attributes: {
      amount: {currency: 'USD', value: '200.12'},
      created: new Date('2023-12-15T23:16:18.810Z'),
      hash: '0xdecfe2e4dc9211fc1b15998d264c11917bf3863f9b2bdc5453a70d8f6c97880f',
      note: 'Test Burn',
      status: 'pending',
      type: 'burn',
      updated: new Date('2023-12-15T23:17:05.476Z'),
    },
    id: '2ZsAP2os6sFVD1CmI2GQpzJu3v9',
    links: {self: {href: '/transactions/2ZsAP2os6sFVD1CmI2GQpzJu3v9'}},
    relationships: {
      deployment: {id: '2Mhfu3ucOsteVVvzxPYHfmU7W9i', type: 'deployment'},
    },
    type: 'transaction',
  },
  {
    attributes: {
      amount: {currency: 'USD', value: '400.26'},
      created: new Date('2023-12-15T22:16:18.810Z'),
      hash: '0xdecfe2e4dc9211fc1b15998d264c11917bf3863f9b2bdc5453a70d8f6c97880f',
      note: 'Test Mint',
      status: 'complete',
      type: 'mint',
      updated: new Date('2023-12-15T22:17:05.476Z'),
    },
    id: '2Zb6l3UjvTGdQSaDVhbtfYHT8yK',
    links: {self: {href: '/transactions/2Zb6l3UjvTGdQSaDVhbtfYHT8yK'}},
    relationships: {
      deployment: {id: '2Mhfu3ucOsteVVvzxPYHfmU7W9i', type: 'deployment'},
      destination: {id: '2MhCCIHulVdXrHiEuQDJvnKbSkl', type: 'address'},
    },
    type: 'transaction',
  },
]
