import analytics from '@components/analytics'
import Button from '@components/Button'
import haptics from '@components/haptics'
import { displayMessage } from '@components/Message'
import {
  QueryKeyRelationship,
  useRelationshipMutation
} from '@utils/queryHooks/relationship'
import { QueryKeyTimeline } from '@utils/queryHooks/timeline'
import { StyleConstants } from '@utils/styles/constants'
import { useTheme } from '@utils/styles/ThemeManager'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { useQueryClient } from 'react-query'

export interface Props {
  id: Mastodon.Account['id']
}

const RelationshipIncoming: React.FC<Props> = ({ id }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()

  const queryKeyRelationship: QueryKeyRelationship = ['Relationship', { id }]
  const queryKeyNotification: QueryKeyTimeline = [
    'Timeline',
    { page: 'Notifications' }
  ]
  const queryClient = useQueryClient()
  const mutation = useRelationshipMutation({
    onSuccess: res => {
      haptics('Success')
      queryClient.setQueryData<Mastodon.Relationship[]>(queryKeyRelationship, [
        res
      ])
      queryClient.refetchQueries(queryKeyNotification)
    },
    onError: (err: any, { type }) => {
      haptics('Error')
      displayMessage({
        type: 'error',
        theme,
        message: t('common:message.error.message', {
          function: t(`relationship:${type}.function`)
        }),
        ...(err.status &&
          typeof err.status === 'number' &&
          err.data &&
          err.data.error &&
          typeof err.data.error === 'string' && {
            description: err.data.error
          })
      })
    }
  })

  return (
    <View style={styles.base}>
      <Button
        round
        type='icon'
        content='X'
        loading={mutation.isLoading}
        onPress={() => {
          analytics('relationship_incoming_press_reject')
          mutation.mutate({
            id,
            type: 'incoming',
            payload: { action: 'reject' }
          })
        }}
      />
      <Button
        round
        type='icon'
        content='Check'
        loading={mutation.isLoading}
        onPress={() => {
          analytics('relationship_incoming_press_authorize')
          mutation.mutate({
            id,
            type: 'incoming',
            payload: { action: 'authorize' }
          })
        }}
        style={styles.approve}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  base: {
    flexShrink: 1,
    flexDirection: 'row'
  },
  approve: {
    marginLeft: StyleConstants.Spacing.M
  }
})

export default RelationshipIncoming
