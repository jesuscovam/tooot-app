import analytics from '@components/analytics'
import CustomText from '@components/Text'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { StyleConstants } from '@root/utils/styles/constants'
import { useTheme } from '@root/utils/styles/ThemeManager'
import { TabLocalStackParamList } from '@utils/navigation/navigators'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { PlaceholderLine } from 'rn-placeholder'

export interface Props {
  account: Mastodon.Account | undefined
  myInfo: boolean
}

const AccountInformationStats: React.FC<Props> = ({ account, myInfo }) => {
  if (account?.suspended) {
    return null
  }

  const navigation = useNavigation<StackNavigationProp<TabLocalStackParamList>>()
  const { colors } = useTheme()
  const { t } = useTranslation('screenTabs')

  return (
    <View style={[styles.stats, { flexDirection: 'row' }]}>
      {account ? (
        <CustomText
          style={[styles.stat, { color: colors.primaryDefault }]}
          children={t('shared.account.summary.statuses_count', {
            count: account.statuses_count || 0
          })}
          onPress={() => {
            analytics('account_stats_toots_press')
            myInfo && account && navigation.push('Tab-Shared-Account', { account })
          }}
        />
      ) : (
        <PlaceholderLine
          width={StyleConstants.Font.Size.S * 1.25}
          height={StyleConstants.Font.LineHeight.S}
          color={colors.shimmerDefault}
          noMargin
          style={{ borderRadius: 0 }}
        />
      )}
      {account ? (
        <CustomText
          style={[styles.stat, { color: colors.primaryDefault, textAlign: 'right' }]}
          children={t('shared.account.summary.following_count', {
            count: account.following_count
          })}
          onPress={() => {
            analytics('account_stats_following_press', {
              count: account.following_count
            })
            navigation.push('Tab-Shared-Users', {
              reference: 'accounts',
              id: account.id,
              type: 'following',
              count: account.following_count
            })
          }}
        />
      ) : (
        <PlaceholderLine
          width={StyleConstants.Font.Size.S * 1.25}
          height={StyleConstants.Font.LineHeight.S}
          color={colors.shimmerDefault}
          noMargin
          style={{ borderRadius: 0 }}
        />
      )}
      {account ? (
        <CustomText
          style={[styles.stat, { color: colors.primaryDefault, textAlign: 'center' }]}
          children={t('shared.account.summary.followers_count', {
            count: account.followers_count
          })}
          onPress={() => {
            analytics('account_stats_followers_press', {
              count: account.followers_count
            })
            navigation.push('Tab-Shared-Users', {
              reference: 'accounts',
              id: account.id,
              type: 'followers',
              count: account.followers_count
            })
          }}
        />
      ) : (
        <PlaceholderLine
          width={StyleConstants.Font.Size.S * 1.25}
          height={StyleConstants.Font.LineHeight.S}
          color={colors.shimmerDefault}
          noMargin
          style={{ borderRadius: 0 }}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  stats: {
    flex: 1,
    justifyContent: 'space-between'
  },
  stat: {
    ...StyleConstants.FontStyle.S
  }
})

export default AccountInformationStats
