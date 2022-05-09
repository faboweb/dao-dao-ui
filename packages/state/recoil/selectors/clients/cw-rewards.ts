import { selectorFamily } from 'recoil'

import { cosmWasmClientSelector } from '../chain'

export const rewardsRateSelector = selectorFamily<string, string>({
  key: 'rewardsRateSelector',
  get:
    (contractAddress: string) =>
    async ({ get }) => {
      const client = get(cosmWasmClientSelector)
      if (!client) return

      const result = await client.queryContractSmart(contractAddress, {
        info: {},
      })

      return result.config.reward_rate
    },
})