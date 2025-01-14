import { useAccessibility } from '@utils/accessibility/AccessibilityManager'
import { useTheme } from '@utils/styles/ThemeManager'
import React, { useMemo, useState } from 'react'
import {
  AccessibilityProps,
  Image,
  ImageStyle,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { Blurhash } from 'react-native-blurhash'

// blurhas -> if blurhash, show before any loading succeed
// original -> load original
// original, remote -> if original failed, then remote
// preview, original -> first show preview, then original
// preview, original, remote -> first show preview, then original, if original failed, then remote

export interface Props {
  accessibilityLabel?: AccessibilityProps['accessibilityLabel']
  accessibilityHint?: AccessibilityProps['accessibilityHint']

  hidden?: boolean
  uri: { preview?: string; original?: string; remote?: string; static?: string }
  blurhash?: string
  dimension?: { width: number; height: number }
  onPress?: () => void
  style?: StyleProp<ViewStyle>
  imageStyle?: StyleProp<ImageStyle>
  // For image viewer when there is no image size available
  setImageDimensions?: React.Dispatch<
    React.SetStateAction<{
      width: number
      height: number
    }>
  >
}

const GracefullyImage = ({
  accessibilityLabel,
  accessibilityHint,
  hidden = false,
  uri,
  blurhash,
  dimension,
  onPress,
  style,
  imageStyle,
  setImageDimensions
}: Props) => {
  const { reduceMotionEnabled } = useAccessibility()
  const { colors } = useTheme()
  const [originalFailed, setOriginalFailed] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const source = originalFailed
    ? { uri: uri.remote || undefined }
    : {
        uri: reduceMotionEnabled && uri.static ? uri.static : uri.original
      }

  const onLoad = () => {
    setImageLoaded(true)
    if (setImageDimensions && source.uri) {
      Image.getSize(source.uri, (width, height) => setImageDimensions({ width, height }))
    }
  }
  const onError = () => {
    if (!originalFailed) {
      setOriginalFailed(true)
    }
  }

  const blurhashView = useMemo(() => {
    if (hidden || !imageLoaded) {
      if (blurhash) {
        return <Blurhash decodeAsync blurhash={blurhash} style={styles.placeholder} />
      } else {
        return <View style={[styles.placeholder, { backgroundColor: colors.shimmerDefault }]} />
      }
    } else {
      return null
    }
  }, [hidden, imageLoaded])

  return (
    <Pressable
      {...(onPress ? { accessibilityRole: 'imagebutton' } : { accessibilityRole: 'image' })}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      style={[style, dimension, { backgroundColor: colors.shimmerDefault }]}
      {...(onPress ? (hidden ? { disabled: true } : { onPress }) : { disabled: true })}
    >
      {uri.preview && !imageLoaded ? (
        <Image
          fadeDuration={0}
          source={{ uri: uri.preview }}
          style={[styles.placeholder, { backgroundColor: colors.shimmerDefault }]}
        />
      ) : null}
      {Platform.OS === 'ios' ? (
        <Image
          fadeDuration={0}
          source={source}
          style={[{ flex: 1 }, imageStyle]}
          onLoad={onLoad}
          onError={onError}
        />
      ) : (
        <FastImage
          fadeDuration={0}
          source={source}
          // @ts-ignore
          style={[{ flex: 1 }, imageStyle]}
          onLoad={onLoad}
          onError={onError}
        />
      )}
      {blurhashView}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  placeholder: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  }
})

export default GracefullyImage
