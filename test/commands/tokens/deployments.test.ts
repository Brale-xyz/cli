/* eslint-disable new-cap */
import {expect, test} from '@oclif/test'

import * as api from '../../../src/api'
import {DeploymentData, DeploymentDataFromJSON} from '../../../src/gen/api'
import {preConfigure} from '../../fixtures/config'
import {TokensApiStub, deployments} from '../../fixtures/tokens-api'

describe('tokens deployments', () => {
  preConfigure(test)
    .stub(api, 'tokensAPI', (stub) => stub.returns(new TokensApiStub()))
    .stdout()
    .command(['tokens deployments', 'TICK1'])
    .it('returns deployments for given token ticker', (ctx) => {
      deployments.map((d) => DeploymentDataFromJSON(d)).map((a) => assertDeploymentDataInOutput(ctx.stdout, a))
    })

  preConfigure(test)
    .stub(api, 'tokensAPI', (stub) => stub.returns(new TokensApiStub()))
    .stdout()
    .command(['tokens deployments', 'TOCK'])
    .catch((error) => expect(error.message).to.equal(`Couldn't find token for ticker: TOCK`))
    .it('returns an error if token not found for ticker')

  preConfigure(test)
    .stub(api, 'tokensAPI', (stub) => stub.returns(new TokensApiStub()))
    .stdout()
    .command(['tokens deployments', 'TICK1', '-c', 'solana'])
    .it('returns specific deployment matching given chain id', (ctx) => {
      const expected = DeploymentDataFromJSON(deployments.at(-1))

      assertDeploymentDataInOutput(ctx.stdout, expected)

      deployments
        .map((d) => DeploymentDataFromJSON(d))
        .filter((d) => d.attributes.chain.id !== 'solana')
        .map((d) => expect(ctx.stdout).to.not.contain(d.id))
    })
})

function assertDeploymentDataInOutput(stdout: string, d: DeploymentData) {
  expect(stdout).to.contain(d.id)
  expect(stdout).to.contain(d.attributes.address)
  expect(stdout).to.contain(d.attributes.created.toISOString())
  expect(stdout).to.contain(d.attributes.chain.id)
}
