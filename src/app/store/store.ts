import { configureStore } from '@reduxjs/toolkit'
import { assetsReducer, binanceAssetsReducer } from '@/features/assets'

export const store = configureStore({
  reducer: {
    assetsReducer,
    binanceAssetsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch