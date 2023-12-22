import {expect, test} from '@oclif/test'

import * as api from '../../../src/api'
import {AddressData} from '../../../src/gen/api'
import {AddressesApiStub, addresses} from '../../fixtures/addresses-api'

describe('addresses', () => {
  test
    .stub(api, 'addressesAPI', (stub) => stub.returns(new AddressesApiStub()))
    .stdout()
    .command(['addresses'])
    .it('returns all addresses', (ctx) => {
      addresses.map((a) => assertAddressDataInOutput(ctx.stdout, a))
    })

  test
    .stub(api, 'addressesAPI', (stub) => stub.returns(new AddressesApiStub()))
    .stdout()
    .command(['addresses', '-t', 'custodial'])
    .it('returns only custodial addresses', (ctx) => {
      addresses.filter((a) => a.attributes.type === 'custodial').map((a) => assertAddressDataInOutput(ctx.stdout, a))

      const eoa = addresses.find((a) => a.attributes.type !== 'custodial')
      expect(ctx.stdout).to.not.contain(eoa?.id)
    })

  test
    .stub(api, 'addressesAPI', (stub) => stub.returns(new AddressesApiStub()))
    .stdout()
    .command(['addresses', '-t', 'externally-owned'])
    .it('returns only custodial addresses', (ctx) => {
      addresses
        .filter((a) => a.attributes.type === 'externally-owned')
        .map((a) => assertAddressDataInOutput(ctx.stdout, a))

      const eoa = addresses.find((a) => a.attributes.type !== 'externally-owned')
      expect(ctx.stdout).to.not.contain(eoa?.id)
    })
})

function assertAddressDataInOutput(stdout: string, d: AddressData) {
  expect(stdout).to.contain(d.id)
  expect(stdout).to.contain(d.attributes.address)
  expect(stdout).to.contain(d.attributes.created.toISOString())
  expect(stdout).to.contain(d.attributes.name)
  expect(stdout).to.contain(d.attributes.status)
  expect(stdout).to.contain(d.attributes.supportedChains.map((c) => c.id).join(','))
  expect(stdout).to.contain(d.attributes.type)
}
