import {financialInstitutionsAPI} from '../../api'
import {BaseCommand} from '../base'

export default class FinancialInstitutions extends BaseCommand<typeof FinancialInstitutions> {
  static description = 'List financial institutions'

  async run(): Promise<void> {
    const api = await financialInstitutionsAPI(await this.loadConfig())
    const fis = await api.listFinancialInstitutions()

    this.output(fis.data)
  }
}
