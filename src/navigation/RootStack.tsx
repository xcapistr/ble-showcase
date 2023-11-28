import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { PeripheralsStack } from './PeripheralsStack'

import { Routes } from './routes'
import { type RootStackParamList } from './types'
import { HeartRate } from '../screens/HeartRate'
import { Icon } from '../components/Icon'
import { TestPeripheral } from '../screens/TestPeripheral'

const Tabs = createBottomTabNavigator<RootStackParamList>()

export const RootStack = () => (
  <Tabs.Navigator initialRouteName={Routes.HEART_RATE}>
    <Tabs.Screen
      name={Routes.PERIPHERALS_TAB}
      component={PeripheralsStack}
      options={{
        headerShown: false,
        tabBarIcon: ({ color }) => <Icon name="list" color={color} />
      }}
    />
    <Tabs.Screen
      name={Routes.TEST_PERIPHERAL}
      component={TestPeripheral}
      options={{
        tabBarIcon: ({ color }) => <Icon name="heartRate" color={color} />,
        title: 'Test'
      }}
    />
    <Tabs.Screen
      name={Routes.HEART_RATE}
      component={HeartRate}
      options={{
        tabBarIcon: ({ color }) => <Icon name="heartRate" color={color} />,
        title: 'Heart Rate'
      }}
    />
  </Tabs.Navigator>
)
