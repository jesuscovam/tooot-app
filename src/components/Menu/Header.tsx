import React from 'react'
import { View } from 'react-native'
import { StyleConstants } from '@utils/styles/constants'
import { useTheme } from '@utils/styles/ThemeManager'
import CustomText from '@components/Text'

export interface Props {
  heading: string
}

const MenuHeader: React.FC<Props> = ({ heading }) => {
  const { colors } = useTheme()

  return (
    <View style={{ paddingBottom: StyleConstants.Spacing.S }}>
      <CustomText
        fontStyle='S'
        fontWeight='Bold'
        style={{ color: colors.secondary }}
      >
        {heading}
      </CustomText>
    </View>
  )
}

export default MenuHeader
