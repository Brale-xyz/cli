import {expect, test} from '@oclif/test'

import * as api from '../../../src/api'
import {OrderData} from '../../../src/gen/api'
import {preConfigure} from '../../fixtures/config'
import {MintsApiStub, mintOrder} from '../../fixtures/mints-api'
import {TokensApiStub, deployments} from '../../fixtures/tokens-api'

describe('mint', () => {
  const mints = new MintsApiStub()

  preConfigure(test)
    .stub(api, 'tokensAPI', (stub) => stub.returns(new TokensApiStub()))
    .stub(api, 'mintsAPI', (stub) => stub.returns(mints))
    .stdout()
    .command([
      'mint',
      'TOCK', // bad ticker
      '-a',
      '9124.11',
      '-c',
      'polygon',
      '-d',
      '2Zu55Pvfkr4Ko1J16EBsIK9oH8Y',
    ])
    .catch((error) => expect(error.message).to.equal(`Couldn't find token for ticker: TOCK`))
    .it('returns an error if token not found for ticker')

  preConfigure(test)
    .stub(api, 'tokensAPI', (stub) => stub.returns(new TokensApiStub()))
    .stub(api, 'mintsAPI', (stub) => stub.returns(mints))
    .stdout()
    .command([
      'mint',
      'TICK1',
      '-a',
      '9124.11',
      '-c',
      'stellar', // not deployed on stellar
      '-d',
      '2Zu55Pvfkr4Ko1J16EBsIK9oH8Y',
    ])
    .catch((error) => expect(error.message).to.equal(`Couldn't find a deployment for chain: stellar`))
    .it('returns an error if deployment not found for given chain')

  preConfigure(test)
    .stub(api, 'tokensAPI', (stub) => stub.returns(new TokensApiStub()))
    .stub(api, 'mintsAPI', (stub) => stub.returns(mints))
    .stdout()
    .command([
      'mint',
      'TICK1',
      '-a',
      '9124.11',
      '-c',
      'polygon',
      '-d',
      '2Zu55Pvfkr4Ko1J16EBsIK9oH8Y',
      '-n',
      'Some test note',
    ])
    .it('mints token with wire and returns order', (ctx) => {
      const req = mints.submittedReq
      if (req) {
        expect(req.id).to.equal(deployments[1].id)
        expect(req.createMintRequest.data.type).to.equal('order')
        expect(req.createMintRequest.data.relationships.destination).to.deep.equal({
          id: '2Zu55Pvfkr4Ko1J16EBsIK9oH8Y',
          type: 'address',
        })
        expect(req.createMintRequest.data.attributes.amount).to.deep.equal({currency: 'USD', value: '9124.11'})
        expect(req.createMintRequest.data.attributes.note).to.equal('Some test note')

        assertOrderDataInOutput(ctx.stdout, mintOrder)
      } else {
        throw new Error('No mint request was submitted.')
      }
    })

  preConfigure(test)
    .stub(api, 'tokensAPI', (stub) => stub.returns(new TokensApiStub()))
    .stub(api, 'mintsAPI', (stub) => stub.returns(mints))
    .stdout()
    .command([
      'mint',
      'TICK1',
      '-a',
      '9124.11',
      '-c',
      'polygon',
      '-d',
      '2Zu55Pvfkr4Ko1J16EBsIK9oH8Y',
      '-n',
      'Some test note',
      '-p',
      'USDC',
      '-q',
      'ethereum',
    ])
    .it('mints token with USDC and returns order', (ctx) => {
      const req = mints.submittedReq
      if (req) {
        expect(req.id).to.equal(deployments[1].id)
        expect(req.createMintRequest.data.type).to.equal('order')
        expect(req.createMintRequest.data.relationships.destination).to.deep.equal({
          id: '2Zu55Pvfkr4Ko1J16EBsIK9oH8Y',
          type: 'address',
        })
        expect(req.createMintRequest.data.relationships.fundingDeployment).to.deep.equal({
          id: '2ZuBRUPaNqOBOCX1NrEzqrW6267',
          type: 'deployment',
        })
        expect(req.createMintRequest.data.attributes.amount).to.deep.equal({currency: 'USD', value: '9124.11'})
        expect(req.createMintRequest.data.attributes.note).to.equal('Some test note')

        assertOrderDataInOutput(ctx.stdout, mintOrder)
      } else {
        throw new Error('No mint request was submitted.')
      }
    })

  preConfigure(test)
    .stub(api, 'tokensAPI', (stub) => stub.returns(new TokensApiStub()))
    .stub(api, 'mintsAPI', (stub) => stub.returns(mints))
    .stdout()
    .command([
      'mint',
      'TICK1',
      '-a',
      '9124.11',
      '-c',
      'polygon',
      '-d',
      '2Zu55Pvfkr4Ko1J16EBsIK9oH8Y',
      '-n',
      'Some test note',
      '-p',
      'USDC',
      '-q',
      'stellar',
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
