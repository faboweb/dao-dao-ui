import { selectorFamily, waitForAll, waitForAllSettled } from 'recoil'

import {
  Cw721BaseSelectors,
  DaoCoreV2Selectors,
  nftUriDataSelector,
  queryWalletIndexerSelector,
  refreshWalletBalancesIdAtom,
  refreshWalletStargazeNftsAtom,
} from '@dao-dao/state'
import { stakerForNftSelector } from '@dao-dao/state/recoil/selectors/contracts/DaoVotingCw721Staked'
import { ChainId, NftCardInfo, WithChainId } from '@dao-dao/types'
import { StargazeNft } from '@dao-dao/types/nft'
import {
  MAINNET,
  STARGAZE_PROFILE_API_TEMPLATE,
  STARGAZE_URL_BASE,
  transformBech32Address,
} from '@dao-dao/utils'

export const walletStargazeNftCardInfosSelector = selectorFamily<
  NftCardInfo[],
  string
>({
  key: 'walletStargazeNftCardInfos',
  get:
    (walletAddress: string) =>
    async ({ get }) => {
      const stargazeWalletAddress = transformBech32Address(
        walletAddress,
        MAINNET ? ChainId.StargazeMainnet : ChainId.StargazeTestnet
      )

      get(refreshWalletStargazeNftsAtom(stargazeWalletAddress))

      let stargazeNfts: StargazeNft[] = []
      try {
        stargazeNfts = await (
          await fetch(
            STARGAZE_PROFILE_API_TEMPLATE.replace(
              'ADDRESS',
              stargazeWalletAddress
            )
          )
        ).json()
      } catch (err) {
        console.error(err)
      }

      if (!Array.isArray(stargazeNfts)) {
        return []
      }

      const nftCardInfos = get(
        waitForAll(
          stargazeNfts.map(({ collection, tokenId, tokenUri }) =>
            nftCardInfoWithUriSelector({
              collection: collection.contractAddress,
              tokenId,
              tokenUri,
              chainId: MAINNET
                ? ChainId.StargazeMainnet
                : ChainId.StargazeTestnet,
            })
          )
        )
      )

      return nftCardInfos
    },
})

export const nftCardInfoWithUriSelector = selectorFamily<
  NftCardInfo,
  WithChainId<{
    collection: string
    tokenId: string
    tokenUri?: string | null | undefined
  }>
>({
  key: 'nftCardInfo',
  get:
    ({ tokenId, collection, tokenUri, chainId }) =>
    async ({ get }) => {
      const collectionInfo = get(
        Cw721BaseSelectors.contractInfoSelector({
          contractAddress: collection,
          chainId,
          params: [],
        })
      )

      const metadata =
        (tokenUri && get(nftUriDataSelector(tokenUri))) || undefined
      const { name = '', description, imageUrl, externalLink } = metadata || {}

      const info: NftCardInfo = {
        collection: {
          address: collection,
          name: collectionInfo.name,
        },
        tokenId,
        externalLink:
          externalLink ||
          (chainId === ChainId.StargazeMainnet
            ? {
                href: `${STARGAZE_URL_BASE}/media/${collection}/${tokenId}`,
                name: 'Stargaze',
              }
            : undefined),
        // Default to tokenUri; this gets overwritten if tokenUri contains valid
        // metadata and has an image.
        imageUrl: imageUrl || tokenUri || undefined,
        metadata,
        name,
        description,
        chainId,
      }

      return info
    },
})

export const nftCardInfoSelector = selectorFamily<
  NftCardInfo,
  WithChainId<{ tokenId: string; collection: string }>
>({
  key: 'nftCardInfo',
  get:
    ({ tokenId, collection, chainId }) =>
    async ({ get }) => {
      const tokenInfo = get(
        Cw721BaseSelectors.nftInfoSelector({
          contractAddress: collection,
          chainId,
          params: [{ tokenId }],
        })
      )

      return get(
        nftCardInfoWithUriSelector({
          tokenId,
          collection,
          tokenUri: tokenInfo.token_uri,
          chainId,
        })
      )
    },
})

export const nftCardInfosForDaoSelector = selectorFamily<
  NftCardInfo[],
  WithChainId<{
    coreAddress: string
    // If DAO is using the cw721-staking voting module adapter, it will have an
    // NFT governance collection. If this is the case, passing it here makes
    // sure we include the collection if it is not in the DAO's cw721 token
    // list.
    governanceCollectionAddress?: string
  }>
>({
  key: 'nftCardInfosForDao',
  get:
    ({ chainId, coreAddress, governanceCollectionAddress }) =>
    async ({ get }) => {
      // TODO: Store NFT collections for polytone proxies with another prefix.
      // const polytoneProxies = Object.entries(
      //   get(
      //     daoCorePolytoneProxiesSelector({
      //       chainId,
      //       coreAddress,
      //     })
      //   )
      // )

      return [[chainId, coreAddress] /* ...polytoneProxies */].flatMap(
        ([chainId, coreAddress]) => {
          // Get all NFT collection addresses for the DAO.
          const nftCollectionAddresses = get(
            DaoCoreV2Selectors.allCw721TokenListSelector({
              contractAddress: coreAddress,
              chainId,
              governanceCollectionAddress,
            })
          )

          // Get all token IDs owned by the DAO for each collection.
          const nftCollectionTokenIds = get(
            waitForAll(
              nftCollectionAddresses.map((collectionAddress) =>
                Cw721BaseSelectors.allTokensForOwnerSelector({
                  contractAddress: collectionAddress,
                  chainId,
                  owner: coreAddress,
                })
              )
            )
          )

          // Get all cards for each collection.
          const nftCardInfos = get(
            waitForAll(
              nftCollectionAddresses.flatMap((collectionAddress, index) =>
                nftCollectionTokenIds[index].map((tokenId) =>
                  nftCardInfoSelector({
                    tokenId,
                    collection: collectionAddress,
                    chainId,
                  })
                )
              )
            )
          )

          return nftCardInfos
        }
      )
    },
})

type CollectionWithTokens = {
  collectionAddress: string
  tokens: string[]
}

// Retrieve all NFTs for a given wallet address using the indexer.
export const walletNftCardInfos = selectorFamily<
  NftCardInfo[],
  WithChainId<{
    walletAddress: string
  }>
>({
  key: 'walletNftCardInfos',
  get:
    ({ walletAddress, chainId }) =>
    async ({ get }) => {
      const id = get(refreshWalletBalancesIdAtom(walletAddress))

      const collections: CollectionWithTokens[] = get(
        queryWalletIndexerSelector({
          chainId,
          walletAddress,
          formula: 'nft/collections',
          id,
        })
      )
      if (!collections || !Array.isArray(collections)) {
        return []
      }

      const nftCardInfos = get(
        waitForAllSettled(
          collections.flatMap(({ collectionAddress, tokens }) =>
            tokens.map((tokenId) =>
              nftCardInfoSelector({
                collection: collectionAddress,
                tokenId,
                chainId,
              })
            )
          )
        )
      )

      return nftCardInfos
        .map((loadable) =>
          loadable.state === 'hasValue' ? loadable.contents : undefined
        )
        .filter((info): info is NftCardInfo => info !== undefined)
    },
})

// Retrieve all NFTs a given wallet address has staked with a DAO (via
// dao-voting-cw721-staked) using the indexer.
export const walletStakedNftCardInfosSelector = selectorFamily<
  NftCardInfo[],
  WithChainId<{
    walletAddress: string
  }>
>({
  key: 'walletStakedNftCardInfos',
  get:
    ({ walletAddress, chainId }) =>
    async ({ get }) => {
      const id = get(refreshWalletBalancesIdAtom(walletAddress))

      const collections: CollectionWithTokens[] = get(
        queryWalletIndexerSelector({
          chainId,
          walletAddress,
          formula: 'nft/stakedWithDaos',
          id,
        })
      )
      if (!collections || !Array.isArray(collections)) {
        return []
      }

      const nftCardInfos = get(
        waitForAllSettled(
          collections.flatMap(({ collectionAddress, tokens }) =>
            tokens.map((tokenId) =>
              nftCardInfoSelector({
                collection: collectionAddress,
                tokenId,
                chainId,
              })
            )
          )
        )
      )

      return nftCardInfos
        .map((loadable) =>
          loadable.state === 'hasValue' ? loadable.contents : undefined
        )
        .filter((info): info is NftCardInfo => info !== undefined)
        .map((info) => ({
          ...info,
          staked: true,
        }))
    },
})

// Get owner of NFT, or staker if NFT is staked with the given staking contract.
export const nftStakerOrOwnerSelector = selectorFamily<
  {
    staked: boolean
    address: string
  },
  WithChainId<{
    collectionAddress: string
    tokenId: string
    stakingContractAddress?: string
  }>
>({
  key: 'nftStakerOrOwner',
  get:
    ({ collectionAddress, tokenId, stakingContractAddress, chainId }) =>
    async ({ get }) => {
      const { owner } = get(
        Cw721BaseSelectors.ownerOfSelector({
          contractAddress: collectionAddress,
          params: [{ tokenId }],
          chainId,
        })
      )

      const staker =
        stakingContractAddress && owner === stakingContractAddress
          ? get(
              stakerForNftSelector({
                contractAddress: stakingContractAddress,
                tokenId,
                chainId,
              })
            )
          : undefined

      return {
        staked: staker !== undefined,
        address: staker || owner,
      }
    },
})
