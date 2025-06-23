export type OutputType = 'json' | 'table'

export type ResourceObject = {
  attributes: object
  id: string
}

// New types for the updated Brale API
export type Account = {
  id: string
  name: string
  status: string
  created: string
}

export type Address = {
  id: string
  name: string
  status: string
  type: string
  address: string
  created: string
  transfer_types: string[]
}

export type Transfer = {
  id: string
  status: string
  amount: {
    value: string
    currency: string
  }
  source: {
    value_type: string
    transfer_type: string
    address_id?: string
    financial_institution_id?: string
  }
  destination: {
    value_type: string
    transfer_type: string
    address_id?: string
    financial_institution_id?: string
  }
  created_at: string
  updated_at: string
  note?: string
  wire_instructions?: object
}

export type Balance = {
  address_id: string
  value_type: string
  balance: string
  transfer_type: string
}
