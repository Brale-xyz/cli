import {expect} from '@oclif/test'
import {SinonStub, stub} from 'sinon'

import {getToken} from '../src/oauth'

describe('getToken', () => {
  it('should use client creds to get a token', async () => {
    const s = stub(global, 'fetch').resolves(new Response(Buffer.from(`{"access_token": "foo"}`))) as SinonStub

    const token = await getToken({
      apiHost: 'httsp://api.xyz',
      authHost: 'https://auth.xyz',
      clientId: 'cId',
      clientSecret: 'cSecret',
    })

    const [[url, opts]] = s.args

    expect(url).to.equal('https://auth.xyz/oauth2/token')
    expect(token).to.equal('foo')

    expect(opts.method).to.equal('POST')
    expect(opts.headers.Authorization).to.equal('Basic ' + Buffer.from('cId:cSecret').toString('base64'))
    expect(opts.headers['Content-Type']).to.equal('application/x-www-form-urlencoded')

    const form = new URLSearchParams()
    form.append('grant_type', 'client_credentials')
    expect(opts.body).to.deep.equal(form)

    s.restore()
  })
})
