import { ComponentType } from 'react'

import { LoadingData } from '../misc'
import { DaoDropdownInfo } from './DaoDropdown'
import { LinkWrapperProps } from './LinkWrapper'

export interface NavigationTokenPrice {
  label: string
  price: number
  priceDenom: string
  change?: number
}

export interface DappNavigationProps {
  setCommandModalVisible: () => void
  inboxCount: LoadingData<number>
  version: string
  tokenPrices?: LoadingData<NavigationTokenPrice[]>
  followingDaos: LoadingData<DaoDropdownInfo[]>
  walletConnected: boolean
  compact: boolean
  setCompact: (compact: boolean) => void
  mountedInBrowser: boolean
  LinkWrapper: ComponentType<LinkWrapperProps>
}
