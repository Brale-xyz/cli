import {expect, test} from '@oclif/test'

import * as api from '../../../src/api'
import {OrderData} from '../../../src/gen/api'
import {OrdersApiStub, orders} from '../../fixtures/orders-api'

describe('orders', () => {
  test
    .stub(api, 'ordersAPI', (stub) => stub.returns(new OrdersApiStub()))
    .stdout()
    .command(['orders get', orders[0].id])
    .it('returns order', (ctx) => {
      orders.map((a) => assertOrderDataInOutput(ctx.stdout, a))
    })
})

function assertOrderDataInOutput(stdout: string, d: OrderData) {
  expect(stdout).to.contain(d.id)
  expect(stdout).to.contain(d.attributes.type)
  expect(stdout).to.contain(d.attributes.status)
  expect(stdout).to.contain(d.attributes.created.toISOString())
  expect(stdout).to.contain(d.attributes.updated.toISOString())
}
