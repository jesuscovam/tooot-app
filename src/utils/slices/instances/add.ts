import apiGeneral from '@api/general'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '@root/store'
import { InstanceLatest } from '@utils/migrations/instances/migration'

const addInstance = createAsyncThunk(
  'instances/add',
  async ({
    domain,
    token,
    instance,
    appData
  }: {
    domain: InstanceLatest['url']
    token: InstanceLatest['token']
    instance: Mastodon.Instance
    appData: InstanceLatest['appData']
  }): Promise<{ type: 'add' | 'overwrite'; data: InstanceLatest }> => {
    const { store } = require('@root/store')
    const instances = (store.getState() as RootState).instances.instances

    const {
      body: { id, acct, avatar_static }
    } = await apiGeneral<Mastodon.Account>({
      method: 'get',
      domain,
      url: `api/v1/accounts/verify_credentials`,
      headers: { Authorization: `Bearer ${token}` }
    })

    let type: 'add' | 'overwrite'
    type = 'add'
    if (
      instances.length &&
      instances.filter(instance => {
        if (instance.url === domain && instance.account.id === id) {
          return true
        } else {
          return false
        }
      }).length
    ) {
      type = 'overwrite'
    } else {
      type = 'add'
    }

    const { body: preferences } = await apiGeneral<Mastodon.Preferences>({
      method: 'get',
      domain,
      url: `api/v1/preferences`,
      headers: { Authorization: `Bearer ${token}` }
    })

    const { body: filters } = await apiGeneral<Mastodon.Filter[]>({
      method: 'get',
      domain,
      url: `api/v1/filters`,
      headers: { Authorization: `Bearer ${token}` }
    })

    return Promise.resolve({
      type,
      data: {
        active: true,
        appData,
        url: domain,
        token,
        uri: instance.uri,
        urls: instance.urls,
        account: {
          id,
          acct,
          avatarStatic: avatar_static,
          preferences
        },
        version: instance.version,
        ...(instance.configuration && {
          configuration: instance.configuration
        }),
        filters,
        notifications_filter: {
          follow: true,
          follow_request: true,
          favourite: true,
          reblog: true,
          mention: true,
          poll: true,
          status: true,
          update: true
        },
        push: {
          global: { loading: false, value: false },
          decode: { loading: false, value: false },
          alerts: {
            follow: { loading: false, value: true },
            follow_request: { loading: false, value: true },
            favourite: { loading: false, value: true },
            reblog: { loading: false, value: true },
            mention: { loading: false, value: true },
            poll: { loading: false, value: true },
            status: { loading: false, value: true }
          },
          keys: { auth: undefined, public: undefined, private: undefined }
        },
        timelinesLookback: {},
        mePage: {
          lists: { shown: false },
          announcements: { shown: false, unread: 0 }
        },
        drafts: [],
        frequentEmojis: []
      }
    })
  }
)

export default addInstance
