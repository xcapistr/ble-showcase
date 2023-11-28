import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useCallback, useEffect, useState } from 'react'
import { Text, ScrollView, ActivityIndicator, View } from 'react-native'
import { PeripheralsStackParamList } from '../../navigation/types'
import useBLE from '../../hooks/useBle'
import { Device, Service } from 'react-native-ble-plx'
import { ServiceInfo } from './parts/ServiceInfo'
import { TextToCopy } from '../../components/TextToCopy'
import { useFocusEffect } from '@react-navigation/native'

export const PeripheralDetails = ({
  navigation,
  route
}: NativeStackScreenProps<PeripheralsStackParamList, 'PeripheralDetails'>) => {
  const deviceId = route.params.deviceId
  const { bleManager } = useBLE()
  const [isLoading, setIsLoading] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null)

  const connect = useCallback(async () => {
    setIsLoading(true)
    try {
      const deviceConnection = await bleManager.connectToDevice(deviceId)
      await deviceConnection.discoverAllServicesAndCharacteristics()
      setConnectedDevice(deviceConnection)
      const services = await deviceConnection.services()
      setServices(services)
    } catch (e) {
      console.log('FAILED TO CONNECT', e)
    }
    setIsLoading(false)
  }, [])

  useFocusEffect(
    useCallback(() => {
      console.log('focus screen')
      void connect()

      return () => {
        console.log('blur screen')
        connectedDevice?.cancelConnection()
      }
    }, [])
  )

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 20, minHeight: '100%' }}
    >
      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size={'large'} />
        </View>
      ) : (
        <>
          <Text>
            <Text style={{ fontWeight: 'bold' }}>device name: </Text>
            <Text>{connectedDevice?.name ?? 'unnamed'}</Text>
          </Text>
          <Text>
            <Text style={{ fontWeight: 'bold' }}>device id: </Text>
            <TextToCopy>{connectedDevice?.id}</TextToCopy>
          </Text>
          <Text
            style={{
              marginTop: 20,
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 10
            }}
          >
            Services
          </Text>
          {services.map(service => (
            <ServiceInfo key={service.id} service={service} />
          ))}
        </>
      )}
    </ScrollView>
  )
}
