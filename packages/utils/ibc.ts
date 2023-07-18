import { asset_lists } from '@chain-registry/assets'

import { GenericToken, TokenType } from '@dao-dao/types'

import { getChainForChainId, getNativeTokenForChainId } from './chain'
import { concatAddressStartEnd } from './conversion'
import { getFallbackImage } from './getFallbackImage'

// Cache once loaded.
const ibcAssetsMap: Record<
  string,
  | (GenericToken & {
      id: string
      description?: string
    })[]
  | undefined
> = {}
export const getIbcAssets = (chainId: string) => {
  if (!ibcAssetsMap[chainId]) {
    ibcAssetsMap[chainId] =
      asset_lists
        .find(
          ({ chain_name }) =>
            chain_name === getChainForChainId(chainId).chain_name
        )
        ?.assets.map(
          ({
            base,
            symbol,
            logo_URIs: { png, svg, jpeg } = {},
            name,
            display,
            denom_units,
          }) => ({
            chainId,
            id: display,
            type: TokenType.Native,
            denomOrAddress: base,
            symbol,
            decimals:
              denom_units.find(({ denom }) => denom === display)?.exponent ??
              denom_units.find(({ exponent }) => exponent > 0)?.exponent ??
              denom_units[0]?.exponent ??
              0,
            imageUrl: svg || png || jpeg || getFallbackImage(base),
            description: symbol === name ? undefined : name,
          })
        )
        .sort((a, b) => a.symbol.localeCompare(b.symbol)) ?? []
  }

  return ibcAssetsMap[chainId]!
}

// Native token exists if it is the native denom or any of the IBC assets.
export const nativeTokenExists = (chainId: string, denom: string) =>
  denom === getNativeTokenForChainId(chainId).denomOrAddress ||
  getIbcAssets(chainId).some(({ denomOrAddress }) => denomOrAddress === denom)

export const getNativeIbcUsdc = (chainId: string) =>
  getIbcAssets(chainId).find(({ id }) => id === 'usdc')

// Returns true if this denom is the IBC denom for USDC on the current chain.
export const isNativeIbcUsdc = (chainId: string, ibcDenom: string): boolean =>
  ibcDenom === getNativeIbcUsdc(chainId)?.denomOrAddress

// Processes symbol and converts into readable format (cut out middle and add
// ellipses) if long IBC string. Used in `TokenCard` and `TokenDepositModal`.
export const transformIbcSymbol = (
  symbol: string
): { isIbc: boolean; tokenSymbol: string; originalTokenSymbol: string } => {
  const isIbc = symbol.toLowerCase().startsWith('ibc')
  // Truncate IBC denominations to prevent overflow.
  const tokenSymbol = isIbc ? concatAddressStartEnd(symbol, 7, 3) : symbol

  return {
    isIbc,
    tokenSymbol,
    originalTokenSymbol: symbol,
  }
}
