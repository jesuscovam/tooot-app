import React from 'react'

import ScreenSharedAccount from '@screens/Shared/Account'
import ScreenSharedHashtag from '@screens/Shared/Hashtag'
import ScreenSharedToot from '@screens/Shared/Toot'
import ScreenSharedWebview from '@screens/Shared/Webview'
import Compose from '@screens/Shared/Compose'
import ComposeEditAttachment from '@screens/Shared/Compose/EditAttachment'
import ScreenSharedSearch from '@screens/Shared/Search'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import { HeaderLeft } from '@root/components/Header'

const sharedScreens = (Stack: any) => {
  const navigation = useNavigation()
  const { t } = useTranslation()

  return [
    <Stack.Screen
      key='Screen-Shared-Account'
      name='Screen-Shared-Account'
      component={ScreenSharedAccount}
      options={{
        headerTranslucent: true,
        headerStyle: { backgroundColor: 'rgba(255, 255, 255, 0)' },
        headerCenter: () => null,
        headerLeft: () => (
          <HeaderLeft icon='chevron-left' onPress={() => navigation.goBack()} />
        )
      }}
    />,
    <Stack.Screen
      key='Screen-Shared-Hashtag'
      name='Screen-Shared-Hashtag'
      component={ScreenSharedHashtag}
      options={({ route }: any) => ({
        title: `#${decodeURIComponent(route.params.hashtag)}`,
        headerLeft: () => (
          <HeaderLeft icon='chevron-left' onPress={() => navigation.goBack()} />
        )
      })}
    />,
    <Stack.Screen
      key='Screen-Shared-Toot'
      name='Screen-Shared-Toot'
      component={ScreenSharedToot}
      options={() => ({
        title: t('sharedToot:heading'),
        headerLeft: () => (
          <HeaderLeft icon='chevron-left' onPress={() => navigation.goBack()} />
        )
      })}
    />,
    <Stack.Screen
      key='Screen-Shared-Webview'
      name='Screen-Shared-Webview'
      component={ScreenSharedWebview}
      options={() => ({
        stackPresentation: 'modal'
      })}
    />,
    <Stack.Screen
      key='Screen-Shared-Compose'
      name='Screen-Shared-Compose'
      component={Compose}
      options={{
        stackPresentation: 'fullScreenModal'
      }}
    />,
    <Stack.Screen
      key='Screen-Shared-Compose-EditAttachment'
      name='Screen-Shared-Compose-EditAttachment'
      component={ComposeEditAttachment}
      options={{
        stackPresentation: 'modal'
      }}
    />,
    <Stack.Screen
      key='Screen-Shared-Search'
      name='Screen-Shared-Search'
      component={ScreenSharedSearch}
      options={{
        stackPresentation: 'modal'
      }}
    />
  ]
}

export default sharedScreens
