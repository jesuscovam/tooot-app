import { StyleConstants } from '@utils/styles/constants'
import { useTheme } from '@utils/styles/ThemeManager'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, TextInput } from 'react-native'
import formatText from '../../formatText'
import ComposeContext from '../../utils/createContext'

const ComposeSpoilerInput: React.FC = () => {
  const { composeState, composeDispatch } = useContext(ComposeContext)
  const { t } = useTranslation('sharedCompose')
  const { theme } = useTheme()

  return (
    <TextInput
      style={[
        styles.spoilerInput,
        {
          color: theme.primary,
          borderBottomColor: theme.border
        }
      ]}
      autoCapitalize='none'
      autoCorrect={false}
      autoFocus
      enablesReturnKeyAutomatically
      multiline
      placeholder={t('content.root.header.spoilerInput.placeholder')}
      placeholderTextColor={theme.secondary}
      onChangeText={content =>
        formatText({
          textInput: 'spoiler',
          composeDispatch,
          content
        })
      }
      onSelectionChange={({
        nativeEvent: {
          selection: { start, end }
        }
      }) => {
        composeDispatch({
          type: 'spoiler',
          payload: { selection: { start, end } }
        })
      }}
      ref={composeState.textInputFocus.refs.spoiler}
      scrollEnabled
      onFocus={() =>
        composeDispatch({
          type: 'textInputFocus',
          payload: { current: 'spoiler' }
        })
      }
    >
      <Text>{composeState.spoiler.formatted}</Text>
    </TextInput>
  )
}

const styles = StyleSheet.create({
  spoilerInput: {
    ...StyleConstants.FontStyle.M,
    marginTop: StyleConstants.Spacing.S,
    paddingBottom: StyleConstants.Spacing.M,
    marginLeft: StyleConstants.Spacing.Global.PagePadding,
    marginRight: StyleConstants.Spacing.Global.PagePadding,
    borderBottomWidth: 0.5
  }
})

export default ComposeSpoilerInput