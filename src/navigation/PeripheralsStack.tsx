import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Routes } from './routes'
import { type PeripheralsStackParamList } from './types'
import { Peripherals } from '../screens/Peripherals'
import { PeripheralDetails } from '../screens/PeripheralDetails'

const Stack = createNativeStackNavigator<PeripheralsStackParamList>()

export const PeripheralsStack = () => (
  <Stack.Navigator initialRouteName={Routes.PERIPHERALS}>
    <Stack.Screen name={Routes.PERIPHERALS} component={Peripherals} />
    <Stack.Screen
      name={Routes.PERIPHERAL_DETAILS}
      component={PeripheralDetails}
      options={{
        title: 'Detail'
      }}
    />
  </Stack.Navigator>
)
