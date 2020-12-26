import React, { useCallback, useState } from 'react'
import { Image, Pressable, StyleSheet, View } from 'react-native'
import { Audio } from 'expo-av'
import { ButtonRow } from '@components/Button'
import layoutAnimation from '@root/utils/styles/layoutAnimation'
import { Surface } from 'gl-react-expo'
import { Blurhash } from 'gl-react-blurhash'
import Slider from '@react-native-community/slider'
import { StyleConstants } from '@root/utils/styles/constants'
import { useTheme } from '@root/utils/styles/ThemeManager'

export interface Props {
  sensitiveShown: boolean
  audio: Mastodon.AttachmentAudio
}

const AttachmentAudio: React.FC<Props> = ({ sensitiveShown, audio }) => {
  layoutAnimation()

  const { theme } = useTheme()

  const [audioPlayer, setAudioPlayer] = useState<Audio.Sound>()
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [audioPosition, setAudioPosition] = useState(0)
  const playAudio = useCallback(async () => {
    if (!audioPlayer) {
      await Audio.setAudioModeAsync({ interruptionModeIOS: 1 })
      const { sound } = await Audio.Sound.createAsync(
        { uri: audio.url },
        {},
        // @ts-ignore
        props => setAudioPosition(props.positionMillis)
      )
      setAudioPlayer(sound)
    } else {
      await audioPlayer.setPositionAsync(audioPosition)
      audioPlayer.playAsync()
      setAudioPlaying(true)
    }
  }, [audioPlayer, audioPosition])
  const pauseAudio = useCallback(async () => {
    audioPlayer!.pauseAsync()
    setAudioPlaying(false)
  }, [audioPlayer])

  return (
    <>
      <Pressable style={styles.overlay}>
        {sensitiveShown ? (
          audio.blurhash && (
            <Surface
              style={{
                width: '100%',
                height: '100%'
              }}
            >
              <Blurhash hash={audio.blurhash} />
            </Surface>
          )
        ) : (
          <>
            {(audio.preview_url || audio.preview_remote_url) && (
              <Image
                style={styles.background}
                source={{ uri: audio.preview_url || audio.preview_remote_url }}
              />
            )}
            <ButtonRow
              icon={audioPlaying ? 'pause' : 'play'}
              size='L'
              {...(audioPlaying
                ? { onPress: pauseAudio }
                : { onPress: playAudio })}
            />
          </>
        )}
      </Pressable>
      <View
        style={{
          flex: 1,
          alignSelf: 'flex-end',
          backgroundColor: theme.backgroundOverlay,
          paddingHorizontal: StyleConstants.Spacing.Global.PagePadding,
          paddingVertical: StyleConstants.Spacing.XS,
          borderRadius: 6,
          opacity: sensitiveShown ? 0.35 : undefined
        }}
      >
        <Slider
          style={{
            width: '100%'
          }}
          minimumValue={0}
          maximumValue={audio.meta.original.duration * 1000}
          value={audioPosition}
          minimumTrackTintColor={theme.primary}
          maximumTrackTintColor={theme.secondary}
          onSlidingStart={() => {
            audioPlayer?.pauseAsync()
            setAudioPlaying(false)
          }}
          onSlidingComplete={value => {
            setAudioPosition(value)
          }}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  background: { position: 'absolute', width: '100%', height: '100%' },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default AttachmentAudio