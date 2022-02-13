import queryClient from '@helpers/queryClient'
import { store } from '@root/store'
// import { prefetchTimelineQuery } from './queryHooks/timeline'
import { Instance, updateInstanceActive } from './slices/instancesSlice'

const initQuery = async ({
  instance,
  prefetch
}: {
  instance: Instance
  prefetch?: { enabled: boolean; page?: 'Following' | 'LocalPublic' }
}) => {
  store.dispatch(updateInstanceActive(instance))
  await queryClient.resetQueries()

  // if (prefetch?.enabled && instance.timelinesLookback) {
  //   if (
  //     prefetch.page &&
  //     instance.timelinesLookback[prefetch.page]?.ids?.length > 0
  //   ) {
  //     await prefetchTimelineQuery(instance.timelinesLookback[prefetch.page])
  //   }

  //   for (const page of Object.keys(instance.timelinesLookback)) {
  //     if (page !== prefetch.page) {
  //       prefetchTimelineQuery(instance.timelinesLookback[page])
  //     }
  //   }
  // }
}

export default initQuery