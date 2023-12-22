import {
  AddressesApi,
  Configuration,
  FinancialInstitutionsApi,
  MintsApi,
  OrdersApi,
  RedemptionsApi,
  TokensApi,
} from './gen/api'
import {getToken} from './oauth'

export type ApiConfiguration = {
  apiHost: string
  authHost: string
  clientId: string
  clientSecret: string
}

function tokenConfig(basePath: string, token?: string) {
  return new Configuration({accessToken: () => `Bearer ${token}`, basePath})
}

export async function addressesAPI(configuration: ApiConfiguration, token?: string) {
  const t = token ?? (await getToken(configuration))

  return new AddressesApi(tokenConfig(configuration.apiHost, t))
}

export async function financialInstitutionsAPI(configuration: ApiConfiguration, token?: string) {
  const t = token ?? (await getToken(configuration))

  return new FinancialInstitutionsApi(tokenConfig(configuration.apiHost, t))
}

export async function ordersAPI(configuration: ApiConfiguration, token?: string) {
  const t = token ?? (await getToken(configuration))

  return new OrdersApi(tokenConfig(configuration.apiHost, t))
}

export async function tokensAPI(configuration: ApiConfiguration, token?: string) {
  const t = token ?? (await getToken(configuration))

  return new TokensApi(tokenConfig(configuration.apiHost, t))
}

export async function redemptionsAPI(configuration: ApiConfiguration, token?: string) {
  const t = token ?? (await getToken(configuration))

  return new RedemptionsApi(
    new Configuration({
      accessToken: () => `Bearer ${t}`,
      basePath: configuration.apiHost,
      headers: {'Idempotency-Key': Date.now().toString()},
    }),
  )
}

export async function mintsAPI(configuration: ApiConfiguration, token?: string) {
  const t = token ?? (await getToken(configuration))

  return new MintsApi(
    new Configuration({
      accessToken: () => `Bearer ${t}`,
      basePath: configuration.apiHost,
      headers: {'Idempotency-Key': Date.now().toString()},
    }),
  )
}
