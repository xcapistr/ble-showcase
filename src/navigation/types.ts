import { Routes } from './routes'

export type RootStackParamList = {
  [Routes.PERIPHERALS_TAB]: undefined
  [Routes.TEST_PERIPHERAL]: undefined
  [Routes.HEART_RATE]: undefined
}

export type PeripheralsStackParamList = {
  [Routes.PERIPHERALS]: undefined
  [Routes.PERIPHERAL_DETAILS]: { deviceId: string }
}
