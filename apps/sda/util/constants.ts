export const DAO_CODE_ID = parseInt(
  process.env.NEXT_PUBLIC_DAO_CONTRACT_CODE_ID as string,
  10
)

export const CW20_CODE_ID = parseInt(process.env.NEXT_PUBLIC_CW20_CODE_ID!, 10)

export const STAKE_CODE_ID = parseInt(
  process.env.NEXT_PUBLIC_STAKE_CW20_CODE_ID as string,
  10
)

export const C4_GROUP_CODE_ID = parseInt(
  process.env.NEXT_PUBLIC_C4_GROUP_CODE_ID as string,
  10
)

export const SITE_TITLE = process.env.NEXT_PUBLIC_SITE_TITLE as string

export const NATIVE_DECIMALS = 6
export const NATIVE_DENOM = process.env.NEXT_PUBLIC_FEE_DENOM as string

export const GAS_PRICE = process.env.NEXT_PUBLIC_GAS_PRICE as string

export const STATUS_COLORS: { [key: string]: string } = {
  open: '#00BAFF',
  draft: '#00F',
  executed: '#53D0C9',
  passed: '#6A78FF',
  rejected: '#ED5276',
}

export const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID as string
export const CHAIN_TXN_URL_PREFIX = process.env.NEXT_PUBLIC_CHAIN_TXN_URL_PREFIX

export const DAO_ADDRESS = process.env.NEXT_PUBLIC_DAO_ADDRESS as string
export const REWARDS_ADDRESS = process.env.NEXT_PUBLIC_REWARDS_ADDRESS as string
export const TOKEN_SWAP_ADDRESS = process.env
  .NEXT_PUBLIC_TOKEN_SWAP_ADDRESS as string
export const OLD_PROPOSALS_ADDRESS = process.env
  .NEXT_PUBLIC_OLD_PROPOSALS_ADDRESS as string

export const VOTE_EXTERNAL_URL = process.env
  .NEXT_PUBLIC_VOTE_EXTERNAL_URL as string
export const AIRDROP_URL = process.env.NEXT_PUBLIC_AIRDROP_URL as string
export const DEFAULT_IMAGE_URL = process.env
  .NEXT_PUBLIC_DEFAULT_IMAGE_URL as string

export const CI = process.env.CI === 'true'
