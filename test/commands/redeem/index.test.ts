import {expect, test} from '@oclif/test'

import * as api from '../../../src/api'
import {OrderData} from '../../../src/gen/api'
import {RedemptionsApiStub, redeemOrder} from '../../fixtures/redemptions-api'
import {TokensApiStub, deployments} from '../../fixtures/tokens-api'

describe('redeem', () => {
  const redemptions = new RedemptionsApiStub()

  test
    .stub(api, 'tokensAPI', (stub) => stub.returns(new TokensApiStub()))
    .stub(api, 'redemptionsAPI', (stub) => stub.returns(redemptions))
    .stdout()
    .command([
      'redeem',
      'TOCK', // bad ticker
      '-a',
      '9124.11',
      '-c',
      'polygon',
      '-p',
      'wire',
      '-f',
      '2Zu55Pvfkr4Ko1J16EBsIK9oH8Y',
    ])
    .catch((error) => expect(error.message).to.equal(`Couldn't find token for ticker: TOCK`))
    .it('returns an error if token not found for ticker')

  test
    .stub(api, 'tokensAPI', (stub) => stub.returns(new TokensApiStub()))
    .stub(api, 'redemptionsAPI', (stub) => stub.returns(redemptions))
    .stdout()
    .command([
      'redeem',
      'TICK1',
      '-a',
      '9124.11',
      '-c',
      'stellar', // not deployed on stellar
      '-p',
      'wire',
      '-f',
      '2Zu55Pvfkr4Ko1J16EBsIK9oH8Y',
    ])
    .catch((error) => expect(error.message).to.equal(`Couldn't find a deployment for chain: stellar`))
    .it('returns an error if deployment not found for given chain')

  test
    .stub(api, 'tokensAPI', (stub) => stub.returns(new TokensApiStub()))
    .stub(api, 'redemptionsAPI', (stub) => stub.returns(redemptions))
    .stdout()
    .command([
      'redeem',
      'TICK1',
      '-a',
      '9124.11',
      '-c',
      'polygon',
      '-p',
      'wire',
      '-f',
      '2Zu55Pvfkr4Ko1J16EBsIK9oH8Y',
      '-n',
      'Some test note',
    ])
    .it('redeems to the target financial institution and returns order', (ctx) => {
      const req = redemptions.submittedReq
      if (req) {
        expect(req.id).to.equal(deployments[1].id)
        expect(req.createRedemptionRequest.data.type).to.equal('order')
        expect(req.createRedemptionRequest.data.relationships?.paymentDestination).to.deep.equal({
          id: '2Zu55Pvfkr4Ko1J16EBsIK9oH8Y',
          type: 'financial-institution',
        })
        expect(req.createRedemptionRequest.data.attributes.amount).to.deep.equal({currency: 'USD', value: '9124.11'})
        expect(req.createRedemptionRequest.data.attributes.note).to.equal('Some test note')

        assertOrderDataInOutput(ctx.stdout, redeemOrder)
      } else {
        throw new Error('No redemption request was submitted.')
      }
    })

  test
    .stub(api, 'tokensAPI', (stub) => stub.returns(new TokensApiStub()))
    .stub(api, 'redemptionsAPI', (stub) => stub.returns(redemptions))
    .stdout()
    .command([
      'redeem',
      'TICK1',
      '-a',
      '9124.11',
      '-c',
      'polygon',
      '-n',
      'Some test note',
      '-p',
      'USDC',
      '-q',
      'ethereum',
      '-d',
      '2ZuI4MDv8hafJelFkGd8zVDH21H',
    ])
    .it('redeems to USDC and returns order', (ctx) => {
      const req = redemptions.submittedReq
      if (req) {
        expect(req.id).to.equal(deployments[1].id)
        expect(req.createRedemptionRequest.data.type).to.equal('order')
        expect(req.createRedemptionRequest.data.relationships?.paymentDeployment).to.deep.equal({
          id: '2ZuBRUPaNqOBOCX1NrEzqrW6267',
          type: 'deployment',
        })
        expect(req.createRedemptionRequest.data.relationships?.paymentDestination).to.deep.equal({
          id: '2ZuI4MDv8hafJelFkGd8zVDH21H',
          type: 'address',
        })
        expect(req.createRedemptionRequest.data.attributes.amount).to.deep.equal({currency: 'USD', value: '9124.11'})
        expect(req.createRedemptionRequest.data.attributes.note).to.equal('Some test note')

        assertOrderDataInOutput(ctx.stdout, redeemOrder)
      } else {
        throw new Error('No redemption request was submitted.')
      }
    })

  test
    .stub(api, 'tokensAPI', (stub) => stub.returns(new TokensApiStub()))
    .stub(api, 'redemptionsAPI', (stub) => stub.returns(redemptions))
    .stdout()
    .command([
      'redeem',
      'TICK1',
      '-a',
      '9124.11',
      '-c',
      'polygon',
      '-n',
      'Some test note',
      '-p',
      'USDC',
      '-q',
      'stellar',
      '-d',
      '2ZuI4MDv8hafJelFkGd8zVDH21H',
    ])
    .catch((error) => expect(error.message).to.equal(`Could not find USDC deployment for chain: stellar`))
    .it('returns an error if USDC deployment is not found for chain')
})

function assertOrderDataInOutput(stdout: string, d: OrderData) {
  expect(stdout).to.contain(d.id)
  expect(stdout).to.contain(d.attributes.type)
  expect(stdout).to.contain(d.attributes.status)
  expect(stdout).to.contain(d.attributes.created.toISOString())
  expect(stdout).to.contain(d.attributes.updated.toISOString())
}
