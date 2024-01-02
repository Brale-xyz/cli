import {test} from '@oclif/test'
import * as os from 'node:os'

import * as oauth from '../../src/oauth'

type Test = typeof test

export function preConfigure(test: Test): Test {
  return test
    .env({XDG_CONFIG_HOME: os.tmpdir()})
    .loadConfig()
    .stub(oauth, 'getToken', (stub) => stub.resolves('some-token'))
    .command(['configure', '-i', 'some-client-id', '-s', 'some-client-secret'])
}
