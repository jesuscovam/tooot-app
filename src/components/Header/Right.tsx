import { Feather } from '@expo/vector-icons'
import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'

import { useTheme } from 'src/utils/styles/ThemeManager'
import { StyleConstants } from 'src/utils/styles/constants'

type PropsBase = {
  onPress: () => void
}

export interface PropsText extends PropsBase {
  text: string
  icon?: string
}

export interface PropsIcon extends PropsBase {
  text?: string
  icon: string
}

const HeaderRight: React.FC<PropsText | PropsIcon> = ({
  onPress,
  text,
  icon
}) => {
  const { theme } = useTheme()

  return (
    <Pressable onPress={onPress} style={styles.base}>
      {text && <Text style={[styles.text, { color: theme.primary }]}>{text}</Text>}
      {icon && (
        <Feather
          name={icon}
          color={theme.primary}
          size={StyleConstants.Font.Size.L}
        />
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    paddingLeft: StyleConstants.Spacing.S
  },
  text: {
    fontSize: StyleConstants.Font.Size.L
  }
})

export default HeaderRight