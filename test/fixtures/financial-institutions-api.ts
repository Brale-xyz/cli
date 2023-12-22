/* eslint-disable new-cap */
import {
  FinancialInstitutionData,
  FinancialInstitutionDataFromJSON,
  FinancialInstitutionList,
  FinancialInstitutionListFromJSON,
  FinancialInstitutionsApi,
  InitOverrideFunction,
} from '../../src/gen/api'

export class FinancialInstitutionsApiStub extends FinancialInstitutionsApi {
  override listFinancialInstitutions(
    _initOverrides?: InitOverrideFunction | RequestInit | undefined,
  ): Promise<FinancialInstitutionList> {
    return Promise.resolve(
      FinancialInstitutionListFromJSON({
        data: fis.map((f) => FinancialInstitutionDataFromJSON(f)),
        links: {
          self: {
            href: '/financial-institutions',
          },
        },
      }),
    )
  }
}

export const fis: Array<FinancialInstitutionData> = [
  {
    attributes: {
      created: new Date('2023-04-05T13:15:17.273Z'),
      name: '222222228',
      routingNumber: '222222228',
      status: 'archived',
    },
    id: '2O0bbQgbSL52PktkiTgv3yq3hiB',
    links: {
      self: {
        href: '/financial-institutions/2O0bbQgbSL52PktkiTgv3yq3hiB',
      },
    },
    type: 'financial-institution',
  },
  {
    attributes: {
      created: new Date('2023-08-28T21:22:26.696Z'),
      name: '222222222',
      routingNumber: '222222222',
      status: 'active',
    },
    id: '2Ud7kWyazu9hLsAZplGH6mv0LBH',
    links: {
      self: {
        href: '/financial-institutions/2Ud7kWyazu9hLsAZplGH6mv0LBH',
      },
    },
    type: 'financial-institution',
  },
  {
    attributes: {
      created: new Date('2023-09-20T23:14:21.583Z'),
      name: '100000001',
      routingNumber: '100000001',
      status: 'active',
    },
    id: '2VgJCTbxCDS16XFYc9zk8nkiWtR',
    links: {
      self: {
        href: '/financial-institutions/2VgJCTbxCDS16XFYc9zk8nkiWtR',
      },
    },
    type: 'financial-institution',
  },
  {
    attributes: {
      created: new Date('2023-11-10T15:29:58.578Z'),
      name: 'CAPITAL ONE, NA',
      routingNumber: '031176110',
      status: 'active',
    },
    id: '2XzS1ITjbKX6OUsZsGLgPpjeD5N',
    links: {
      self: {
        href: '/financial-institutions/2XzS1ITjbKX6OUsZsGLgPpjeD5N',
      },
    },
    type: 'financial-institution',
  },
]
