import {expect, test} from '@oclif/test'

import * as api from '../../../src/api'
import {FinancialInstitutionData} from '../../../src/gen/api'
import {FinancialInstitutionsApiStub, fis} from '../../fixtures/financial-institutions-api'

describe('financial-institutions', () => {
  test
    .stub(api, 'financialInstitutionsAPI', (stub) => stub.returns(new FinancialInstitutionsApiStub()))
    .stdout()
    .command(['financial-institutions'])
    .it('returns all financial-institutions', (ctx) => {
      fis.map((a) => assertFIDataInOutput(ctx.stdout, a))
    })
})

function assertFIDataInOutput(stdout: string, d: FinancialInstitutionData) {
  expect(stdout).to.contain(d.id)
  expect(stdout).to.contain(d.attributes.name)
  expect(stdout).to.contain(d.attributes.created.toISOString())
  expect(stdout).to.contain(d.attributes.routingNumber)
  expect(stdout).to.contain(d.attributes.status)
}
