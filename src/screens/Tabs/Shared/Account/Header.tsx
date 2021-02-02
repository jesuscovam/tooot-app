import { useTheme } from '@utils/styles/ThemeManager'
import React, { useContext } from 'react'
import { Dimensions } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AccountContext from './utils/createContext'

export interface Props {
  account?: Mastodon.Account
  limitHeight?: boolean
}

const AccountHeader: React.FC<Props> = ({ account, limitHeight = false }) => {
  const { accountState } = useContext(AccountContext)
  const { theme } = useTheme()
  const topInset = useSafeAreaInsets().top

  return (
    <FastImage
      source={{ uri: account?.header }}
      style={{
        height:
          Dimensions.get('screen').width * accountState.headerRatio + topInset,
        backgroundColor: theme.disabled
      }}
    />
  )
}

export default React.memo(
  AccountHeader,
  (_, next) => next.account === undefined
)