import {ApiConfiguration} from './api'

type OauthResponse = {
  access_token: string
}

export async function getToken(config: ApiConfiguration): Promise<string> {
  const body = new URLSearchParams()
  body.append('grant_type', 'client_credentials')

  const creds = Buffer.from(config.clientId + ':' + config.clientSecret).toString('base64')

  const response = await fetch(config.authHost + '/oauth2/token', {
    body,
    headers: {
      Authorization: 'Basic ' + creds,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  })

  const json = (await response.json()) as OauthResponse

  return json.access_token
}
