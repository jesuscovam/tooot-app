import { StyleConstants } from '@utils/styles/constants'
import layoutAnimation from '@utils/styles/layoutAnimation'
import { useTheme } from '@utils/styles/ThemeManager'
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'
import {
  ComponentEmojis,
  EmojisButton,
  EmojisContext,
  EmojisList
} from './Emojis'

export interface Props {
  autoFocus?: boolean

  title?: string

  maxLength?: number
  multiline?: boolean

  emoji?: boolean

  value?: string
  setValue:
    | Dispatch<SetStateAction<string | undefined>>
    | Dispatch<SetStateAction<string>>
}

const Input: React.FC<Props> = ({
  autoFocus = true,
  title,
  maxLength,
  multiline = false,
  emoji = false,
  value,
  setValue
}) => {
  const { mode, theme } = useTheme()

  const animateTitle = useAnimatedStyle(() => {
    if (value) {
      return {
        fontSize: withTiming(StyleConstants.Font.Size.S),
        paddingHorizontal: withTiming(StyleConstants.Spacing.XS),
        left: withTiming(StyleConstants.Spacing.S),
        top: withTiming(-(StyleConstants.Font.Size.S / 2) - 2),
        backgroundColor: withTiming(theme.backgroundDefault)
      }
    } else {
      return {
        fontSize: withTiming(StyleConstants.Font.Size.M),
        paddingHorizontal: withTiming(0),
        left: withTiming(StyleConstants.Spacing.S),
        top: withTiming(StyleConstants.Spacing.S + 1),
        backgroundColor: withTiming(theme.backgroundDefaultTransparent)
      }
    }
  }, [mode, value])

  const selectionRange = useRef<{ start: number; end: number }>(
    value
      ? {
          start: value.length,
          end: value.length
        }
      : { start: 0, end: 0 }
  )
  const onSelectionChange = useCallback(
    ({ nativeEvent: { selection } }) => (selectionRange.current = selection),
    []
  )

  const [inputFocused, setInputFocused] = useState(false)
  useEffect(() => {
    layoutAnimation()
  }, [inputFocused])

  return (
    <ComponentEmojis
      enabled={emoji}
      value={value}
      setValue={setValue}
      selectionRange={selectionRange}
    >
      <View style={[styles.base, { borderColor: theme.border }]}>
        <EmojisContext.Consumer>
          {({ emojisDispatch }) => (
            <TextInput
              autoFocus={autoFocus}
              onFocus={() => setInputFocused(true)}
              onBlur={() => {
                setInputFocused(false)
                emojisDispatch({ type: 'activate', payload: false })
              }}
              style={[
                styles.textInput,
                {
                  color: theme.primaryDefault,
                  minHeight:
                    Platform.OS === 'ios' && multiline
                      ? StyleConstants.Font.LineHeight.M * 5
                      : undefined
                }
              ]}
              onChangeText={setValue}
              onSelectionChange={onSelectionChange}
              value={value}
              maxLength={maxLength}
              {...(multiline && {
                multiline,
                numberOfLines: Platform.OS === 'android' ? 5 : undefined
              })}
            />
          )}
        </EmojisContext.Consumer>
        {title ? (
          <Animated.Text
            style={[styles.title, animateTitle, { color: theme.secondary }]}
          >
            {title}
          </Animated.Text>
        ) : null}
        {maxLength && value?.length ? (
          <Text style={[styles.maxLength, { color: theme.secondary }]}>
            {value?.length} / {maxLength}
          </Text>
        ) : null}
        {inputFocused ? <EmojisButton /> : null}
      </View>
      <EmojisList />
    </ComponentEmojis>
  )
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    marginVertical: StyleConstants.Spacing.S,
    padding: StyleConstants.Spacing.S
  },
  title: {
    position: 'absolute'
  },
  textInput: {
    flex: 1,
    fontSize: StyleConstants.Font.Size.M
  },
  maxLength: {
    ...StyleConstants.FontStyle.S
  }
})

export default Input