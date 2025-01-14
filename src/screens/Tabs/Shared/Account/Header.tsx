import Button from '@components/Button'
import GracefullyImage from '@components/GracefullyImage'
import { useTheme } from '@utils/styles/ThemeManager'
import React from 'react'
import { Dimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export interface Props {
  account?: Mastodon.Account
  edit?: boolean
}

const AccountHeader = React.memo(
  ({ account, edit }: Props) => {
    const { colors } = useTheme()
    const topInset = useSafeAreaInsets().top

    return (
      <View>
        <GracefullyImage
          uri={{ original: account?.header, static: account?.header_static }}
          style={{
            height: Dimensions.get('screen').width / 3 + topInset,
            backgroundColor: colors.disabled
          }}
        />
        {edit ? (
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Button type='icon' content='Edit' round onPress={() => {}} />
          </View>
        ) : null}
      </View>
    )
  },
  (_, next) => next.account === undefined
)

export default AccountHeader
