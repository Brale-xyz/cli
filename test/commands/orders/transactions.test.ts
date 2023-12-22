import {expect, test} from '@oclif/test'

import * as api from '../../../src/api'
import {TransactionData} from '../../../src/gen/api'
import {OrdersApiStub, transactions} from '../../fixtures/orders-api'

describe('order transactions', () => {
  test
    .stub(api, 'ordersAPI', (stub) => stub.returns(new OrdersApiStub()))
    .stdout()
    .command(['orders transactions', 'some-id'])
    .it('returns order', (ctx) => {
      transactions.map((a) => assertTransactionDataInOutput(ctx.stdout, a))
    })
})

function assertTransactionDataInOutput(stdout: string, d: TransactionData) {
  expect(stdout).to.contain(d.id)
  expect(stdout).to.contain(d.attributes.type)
  expect(stdout).to.contain(d.attributes.hash)
  expect(stdout).to.contain(d.attributes.note)
  expect(stdout).to.contain(d.attributes.status)
  expect(stdout).to.contain(`$${d.attributes.amount?.value}`)
  expect(stdout).to.contain(d.attributes.created.toISOString())
  expect(stdout).to.contain(d.attributes.updated.toISOString())
}
