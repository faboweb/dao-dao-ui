/**
 * This file was automatically generated by cosmwasm-typescript-gen.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the cosmwasm-typescript-gen generate command to regenerate this file.
 */

import {
  CosmWasmClient,
  ExecuteResult,
  SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate'
export type ActiveThreshold =
  | {
      absolute_count: {
        count: Uint128
        [k: string]: unknown
      }
    }
  | {
      percentage: {
        percent: Decimal
        [k: string]: unknown
      }
    }
export type Uint128 = string
export type Decimal = string
export interface ActiveThresholdResponse {
  active_threshold?: ActiveThreshold | null
  [k: string]: unknown
}
export type DaoResponse = string
export interface InfoResponse {
  info: ContractVersion
  [k: string]: unknown
}
export interface ContractVersion {
  contract: string
  version: string
  [k: string]: unknown
}
export type TokenInfo =
  | {
      existing: {
        address: string
        staking_contract: StakingInfo
        [k: string]: unknown
      }
    }
  | {
      new: {
        code_id: number
        decimals: number
        initial_balances: Cw20Coin[]
        initial_dao_balance?: Uint128 | null
        label: string
        marketing?: InstantiateMarketingInfo | null
        name: string
        staking_code_id: number
        symbol: string
        unstaking_duration?: Duration | null
        [k: string]: unknown
      }
    }
export type StakingInfo =
  | {
      existing: {
        staking_contract_address: string
        [k: string]: unknown
      }
    }
  | {
      new: {
        staking_code_id: number
        unstaking_duration?: Duration | null
        [k: string]: unknown
      }
    }
export type Duration =
  | {
      height: number
    }
  | {
      time: number
    }
export type Logo =
  | {
      url: string
    }
  | {
      embedded: EmbeddedLogo
    }
export type EmbeddedLogo =
  | {
      svg: Binary
    }
  | {
      png: Binary
    }
export type Binary = string
export interface InstantiateMsg {
  active_threshold?: ActiveThreshold | null
  token_info: TokenInfo
  [k: string]: unknown
}
export interface Cw20Coin {
  address: string
  amount: Uint128
  [k: string]: unknown
}
export interface InstantiateMarketingInfo {
  description?: string | null
  logo?: Logo | null
  marketing?: string | null
  project?: string | null
  [k: string]: unknown
}
export interface IsActiveResponse {
  active: boolean
  [k: string]: unknown
}
export type StakingContractResponse = string
export type TokenContractResponse = string
export interface TotalPowerAtHeightResponse {
  height: number
  power: Uint128
  [k: string]: unknown
}
export interface VotingPowerAtHeightResponse {
  height: number
  power: Uint128
  [k: string]: unknown
}
export interface Cw20StakedBalanceVotingReadOnlyInterface {
  contractAddress: string
  stakingContract: () => Promise<StakingContractResponse>
  dao: () => Promise<DaoResponse>
  activeThreshold: () => Promise<ActiveThresholdResponse>
  votingPowerAtHeight: ({
    address,
    height,
  }: {
    address: string
    height?: number
  }) => Promise<VotingPowerAtHeightResponse>
  totalPowerAtHeight: ({
    height,
  }: {
    height?: number
  }) => Promise<TotalPowerAtHeightResponse>
  info: () => Promise<InfoResponse>
  tokenContract: () => Promise<TokenContractResponse>
  isActive: () => Promise<IsActiveResponse>
}
export class Cw20StakedBalanceVotingQueryClient
  implements Cw20StakedBalanceVotingReadOnlyInterface
{
  client: CosmWasmClient
  contractAddress: string

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client
    this.contractAddress = contractAddress
    this.stakingContract = this.stakingContract.bind(this)
    this.dao = this.dao.bind(this)
    this.activeThreshold = this.activeThreshold.bind(this)
    this.votingPowerAtHeight = this.votingPowerAtHeight.bind(this)
    this.totalPowerAtHeight = this.totalPowerAtHeight.bind(this)
    this.info = this.info.bind(this)
    this.tokenContract = this.tokenContract.bind(this)
    this.isActive = this.isActive.bind(this)
  }

  stakingContract = async (): Promise<StakingContractResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      staking_contract: {},
    })
  }
  dao = async (): Promise<DaoResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      dao: {},
    })
  }
  activeThreshold = async (): Promise<ActiveThresholdResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      active_threshold: {},
    })
  }
  votingPowerAtHeight = async ({
    address,
    height,
  }: {
    address: string
    height?: number
  }): Promise<VotingPowerAtHeightResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      voting_power_at_height: {
        address,
        height,
      },
    })
  }
  totalPowerAtHeight = async ({
    height,
  }: {
    height?: number
  }): Promise<TotalPowerAtHeightResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      total_power_at_height: {
        height,
      },
    })
  }
  info = async (): Promise<InfoResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      info: {},
    })
  }
  tokenContract = async (): Promise<TokenContractResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      token_contract: {},
    })
  }
  isActive = async (): Promise<IsActiveResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      is_active: {},
    })
  }
}
export interface Cw20StakedBalanceVotingInterface
  extends Cw20StakedBalanceVotingReadOnlyInterface {
  contractAddress: string
  sender: string
  updateActiveThreshold: ({
    newThreshold,
  }: {
    newThreshold?: ActiveThreshold
  }) => Promise<ExecuteResult>
}
export class Cw20StakedBalanceVotingClient
  extends Cw20StakedBalanceVotingQueryClient
  implements Cw20StakedBalanceVotingInterface
{
  client: SigningCosmWasmClient
  sender: string
  contractAddress: string

  constructor(
    client: SigningCosmWasmClient,
    sender: string,
    contractAddress: string
  ) {
    super(client, contractAddress)
    this.client = client
    this.sender = sender
    this.contractAddress = contractAddress
    this.updateActiveThreshold = this.updateActiveThreshold.bind(this)
  }

  updateActiveThreshold = async ({
    newThreshold,
  }: {
    newThreshold?: ActiveThreshold
  }): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        update_active_threshold: {
          new_threshold: newThreshold,
        },
      },
      'auto'
    )
  }
}
