import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl
} from 'react-native'
import useBLE from '../../hooks/useBle'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Device } from 'react-native-ble-plx'
import {
  NavigationProp,
  useFocusEffect,
  useNavigation
} from '@react-navigation/native'
import { Routes } from '../../navigation/routes'
import { PeripheralsStackParamList } from '../../navigation/types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

export const Peripherals = ({
  navigation
}: NativeStackScreenProps<PeripheralsStackParamList, 'Peripherals'>) => {
  const { navigate } =
    useNavigation<NavigationProp<PeripheralsStackParamList>>()
  const { requestPermissions, bleManager } = useBLE()
  const [devices, setDevices] = useState<Device[]>([])

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions()
    if (isPermissionsEnabled) {
      bleManager.startDeviceScan(
        null,
        { allowDuplicates: false },
        (error, device) => {
          if (error) console.log(JSON.stringify(error))
          if (device) {
            setDevices((prevState: Device[]) => {
              if (!device.name) return prevState

              let nextDevices = [...prevState]
              const deviceIndex = nextDevices.findIndex(
                prevDevice => prevDevice.id === device.id
              )
              if (deviceIndex > -1) {
                nextDevices[deviceIndex] = device
              } else {
                nextDevices.push(device)
              }
              return nextDevices
            })
          }
        }
      )
    }
  }

  const handleItemPress = useCallback(
    (deviceId: string) => navigate(Routes.PERIPHERAL_DETAILS, { deviceId }),
    [navigate]
  )

  const renderItem = useCallback(
    ({ item }: { item: Device }) => {
      return (
        <TouchableOpacity
          style={{
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16
          }}
          onPress={() => handleItemPress(item.id)}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
              {item.name ?? 'unnamed'}
            </Text>
            <Text>{item.id}</Text>
            <Text>{item.localName?.toString()}</Text>
          </View>
          <Text>{item.rssi?.toString()}</Text>
        </TouchableOpacity>
      )
    },
    [devices]
  )

  const ListEmptyComponent = useMemo(
    () => (
      <View style={{ alignItems: 'center', padding: 20, marginTop: 40 }}>
        <Text>No devices found</Text>
        <TouchableOpacity
          style={{
            margin: 20,
            paddingHorizontal: 30,
            paddingVertical: 16,
            backgroundColor: '#ccc',
            borderRadius: 8
          }}
        >
          <Text style={{ fontSize: 14, textTransform: 'uppercase' }}>
            Refresh
          </Text>
        </TouchableOpacity>
      </View>
    ),
    []
  )

  useFocusEffect(
    useCallback(() => {
      scanForDevices()

      return () => {
        bleManager.stopDeviceScan()
      }
    }, [])
  )

  return (
    <FlatList
      data={devices}
      renderItem={renderItem}
      refreshControl={
        // todo set isLoading
        <RefreshControl onRefresh={scanForDevices} refreshing={false} />
      }
      ListEmptyComponent={ListEmptyComponent}
      style={{ flex: 1 }}
      contentContainerStyle={{ minHeight: '100%' }}
    />
  )
}
