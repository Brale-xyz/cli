import {expect, test} from '@oclif/test'
import * as fs from 'node:fs/promises'
import * as os from 'node:os'
import * as path from 'node:path'

import {ApiConfiguration} from '../../../src/api'

describe('configure', () => {
  beforeEach(async () => {
    await fs.rm(path.join(os.tmpdir(), 'brale'), {recursive: true})
  })

  test
    .stdout()
    .env({XDG_CONFIG_HOME: os.tmpdir()}, {clear: true})
    .loadConfig()
    .command(['configure', '-i', 'some-client-id', '-s', 'some-client-secret'])
    .it('stores API credentials', async (ctx) => {
      const c = path.join(ctx.config.configDir, 'config.json')

      const file = await fs.readFile(c)
      const result = JSON.parse(file.toString('utf8')) as ApiConfiguration

      expect(result.clientId).to.equal('some-client-id')
      expect(result.clientSecret).to.equal('some-client-secret')
      expect(result.apiHost).to.equal('https://api.brale.xyz')
      expect(result.authHost).to.equal('https://auth.brale.xyz')
    })

  test
    .stdout()
    .env({XDG_CONFIG_HOME: os.tmpdir()}, {clear: true})
    .loadConfig()
    .command([
      'configure',
      '-i',
      'some-client-id',
      '-s',
      'some-client-secret',
      '-h',
      'https://api.xyz',
      '-a',
      'https://auth.xyz',
    ])
    .it('allows setting api & auth hosts', async (ctx) => {
      const c = path.join(ctx.config.configDir, 'config.json')

      const file = await fs.readFile(c)
      const result = JSON.parse(file.toString('utf8')) as ApiConfiguration

      expect(result.clientId).to.equal('some-client-id')
      expect(result.clientSecret).to.equal('some-client-secret')
      expect(result.apiHost).to.equal('https://api.xyz')
      expect(result.authHost).to.equal('https://auth.xyz')
    })

  test
    .stdout()
    .env({XDG_CONFIG_HOME: os.tmpdir()}, {clear: true})
    .loadConfig()
    .command([
      'configure',
      '-i',
      'some-client-id',
      '-s',
      'some-client-secret',
      '-h',
      'https://api.xyz',
      '-a',
      'https://auth.xyz',
    ])
    .command(['configure', '-i', 'some-client-id', '-s', 'some-client-secret'])
    .it('does not change api & auth host if just updating client id & secret', async (ctx) => {
      const c = path.join(ctx.config.configDir, 'config.json')

      const file = await fs.readFile(c)
      const result = JSON.parse(file.toString('utf8')) as ApiConfiguration

      expect(result.apiHost).to.equal('https://api.xyz')
      expect(result.authHost).to.equal('https://auth.xyz')
    })
})
