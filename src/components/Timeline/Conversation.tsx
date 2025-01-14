import apiInstance from '@api/instance'
import analytics from '@components/analytics'
import GracefullyImage from '@components/GracefullyImage'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { TabLocalStackParamList } from '@utils/navigation/navigators'
import { QueryKeyTimeline } from '@utils/queryHooks/timeline'
import { getInstanceAccount } from '@utils/slices/instancesSlice'
import { StyleConstants } from '@utils/styles/constants'
import { useTheme } from '@utils/styles/ThemeManager'
import { isEqual } from 'lodash'
import React, { useCallback } from 'react'
import { Pressable, View } from 'react-native'
import { useMutation, useQueryClient } from 'react-query'
import { useSelector } from 'react-redux'
import TimelineActions from './Shared/Actions'
import TimelineContent from './Shared/Content'
import TimelineHeaderConversation from './Shared/HeaderConversation'
import TimelinePoll from './Shared/Poll'

const Avatars: React.FC<{ accounts: Mastodon.Account[] }> = ({ accounts }) => {
  return (
    <View
      style={{
        borderRadius: 4,
        overflow: 'hidden',
        marginRight: StyleConstants.Spacing.S,
        width: StyleConstants.Avatar.M,
        height: StyleConstants.Avatar.M,
        flexDirection: 'row',
        flexWrap: 'wrap'
      }}
    >
      {accounts.slice(0, 4).map(account => (
        <GracefullyImage
          key={account.id}
          uri={{ original: account.avatar, static: account.avatar_static }}
          dimension={{
            width: StyleConstants.Avatar.M,
            height:
              accounts.length > 2
                ? StyleConstants.Avatar.M / 2
                : StyleConstants.Avatar.M
          }}
          style={{ flex: 1, flexBasis: '50%' }}
        />
      ))}
    </View>
  )
}

export interface Props {
  conversation: Mastodon.Conversation
  queryKey: QueryKeyTimeline
  highlighted?: boolean
}

const TimelineConversation = React.memo(
  ({ conversation, queryKey, highlighted = false }: Props) => {
    const instanceAccount = useSelector(
      getInstanceAccount,
      (prev, next) => prev?.id === next?.id
    )
    const { colors } = useTheme()

    const queryClient = useQueryClient()
    const fireMutation = useCallback(() => {
      return apiInstance<Mastodon.Conversation>({
        method: 'post',
        url: `conversations/${conversation.id}/read`
      })
    }, [])
    const { mutate } = useMutation(fireMutation, {
      onSettled: () => {
        queryClient.invalidateQueries(queryKey)
      }
    })

    const navigation =
      useNavigation<StackNavigationProp<TabLocalStackParamList>>()
    const onPress = useCallback(() => {
      analytics('timeline_conversation_press')
      if (conversation.last_status) {
        conversation.unread && mutate()
        navigation.push('Tab-Shared-Toot', {
          toot: conversation.last_status,
          rootQueryKey: queryKey
        })
      }
    }, [])

    return (
      <Pressable
        style={[
          {
            flex: 1,
            flexDirection: 'column',
            padding: StyleConstants.Spacing.Global.PagePadding,
            paddingBottom: 0,
            backgroundColor: colors.backgroundDefault
          },
          conversation.unread && {
            borderLeftWidth: StyleConstants.Spacing.XS,
            borderLeftColor: colors.blue,
            paddingLeft:
              StyleConstants.Spacing.Global.PagePadding -
              StyleConstants.Spacing.XS
          }
        ]}
        onPress={onPress}
      >
        <View style={{ flex: 1, width: '100%', flexDirection: 'row' }}>
          <Avatars accounts={conversation.accounts} />
          <TimelineHeaderConversation
            queryKey={queryKey}
            conversation={conversation}
          />
        </View>

        {conversation.last_status ? (
          <>
            <View
              style={{
                paddingTop: highlighted ? StyleConstants.Spacing.S : 0,
                paddingLeft: highlighted
                  ? 0
                  : StyleConstants.Avatar.M + StyleConstants.Spacing.S
              }}
            >
              <TimelineContent
                status={conversation.last_status}
                highlighted={highlighted}
              />
              {conversation.last_status.poll ? (
                <TimelinePoll
                  queryKey={queryKey}
                  statusId={conversation.last_status.id}
                  poll={conversation.last_status.poll}
                  reblog={false}
                  sameAccount={
                    conversation.last_status.id === instanceAccount?.id
                  }
                />
              ) : null}
            </View>
            <TimelineActions
              queryKey={queryKey}
              status={conversation.last_status}
              highlighted={highlighted}
              accts={conversation.accounts.map(account => account.acct)}
              reblog={false}
            />
          </>
        ) : null}
      </Pressable>
    )
  },
  (prev, next) => isEqual(prev.conversation, next.conversation)
)

export default TimelineConversation
