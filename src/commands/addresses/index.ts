import {Flags} from '@oclif/core'

import {addressesAPI} from '../../api'
import {AddressData} from '../../gen/api'
import {BaseCommand} from '../base'

export default class Addresses extends BaseCommand<typeof Addresses> {
  static description = 'List addresses'

  static flags = {
    type: Flags.string({char: 't', description: 'Filter by address type', required: false}),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(Addresses)

    const a = await addressesAPI(await this.loadConfig())
    const addresses = await a.listAddresses()

    if (flags.type) {
      const f = addresses.data.filter((a) => a.attributes.type === flags.type)
      this.output(f, this.format)
    } else {
      this.output(addresses.data, this.format)
    }
  }

  private format(d: AddressData) {
    return {
      supportedChains: d.attributes.supportedChains.map((c) => c.id).join(','),
    }
  }
}
