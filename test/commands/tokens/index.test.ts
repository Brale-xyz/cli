/* eslint-disable new-cap */
import {expect, test} from '@oclif/test'

import * as api from '../../../src/api'
import {TokenData, TokenDataFromJSON} from '../../../src/gen/api'
import {preConfigure} from '../../fixtures/config'
import {TokensApiStub, tokens} from '../../fixtures/tokens-api'

describe('tokens', () => {
  preConfigure(test)
    .stub(api, 'tokensAPI', (stub) => stub.returns(new TokensApiStub()))
    .stdout()
    .command(['tokens'])
    .it('returns all tokens', (ctx) => {
      tokens.map((d) => TokenDataFromJSON(d)).map((a) => assertTokenDataInOutput(ctx.stdout, a))
    })

  preConfigure(test)
    .stub(api, 'tokensAPI', (stub) => stub.returns(new TokensApiStub()))
    .stdout()
    .command(['tokens', '-t', 'TICK2'])
    .it('returns the token with the given ticker', (ctx) => {
      const unexpected = TokenDataFromJSON(tokens[0])
      expect(ctx.stdout).to.not.contain(unexpected.id)

      const expected = TokenDataFromJSON(tokens[1])
      assertTokenDataInOutput(ctx.stdout, expected)
    })
})

function assertTokenDataInOutput(stdout: string, d: TokenData) {
  expect(stdout).to.contain(d.id)
  expect(stdout).to.contain(d.attributes.ticker)
  expect(stdout).to.contain(d.attributes.created.toISOString())
  expect(stdout).to.contain(d.attributes.name)
}
