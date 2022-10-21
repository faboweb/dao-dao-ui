import { Coin, StdFee } from '@cosmjs/amino'
import { ExecuteResult, SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'

import { Binary } from '@dao-dao/types/contracts/common'

export interface CwAdminFactoryInterface {
  contractAddress: string
  sender: string
  instantiateContractWithSelfAdmin: (
    {
      codeId,
      instantiateMsg,
      label,
    }: {
      codeId: number
      instantiateMsg: Binary
      label: string
    },
    fee?: number | StdFee | 'auto',
    memo?: string,
    funds?: Coin[]
  ) => Promise<ExecuteResult>
}
export class CwAdminFactoryClient implements CwAdminFactoryInterface {
  client: SigningCosmWasmClient
  sender: string
  contractAddress: string

  constructor(
    client: SigningCosmWasmClient,
    sender: string,
    contractAddress: string
  ) {
    this.client = client
    this.sender = sender
    this.contractAddress = contractAddress
    this.instantiateContractWithSelfAdmin =
      this.instantiateContractWithSelfAdmin.bind(this)
  }

  instantiateContractWithSelfAdmin = async (
    {
      codeId,
      instantiateMsg,
      label,
    }: {
      codeId: number
      instantiateMsg: Binary
      label: string
    },
    fee: number | StdFee | 'auto' = 'auto',
    memo?: string,
    funds?: Coin[]
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        instantiate_contract_with_self_admin: {
          code_id: codeId,
          instantiate_msg: instantiateMsg,
          label,
        },
      },
      fee,
      memo,
      funds
    )
  }
}
