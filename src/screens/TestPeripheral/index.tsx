import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useEffect, useState } from 'react'
import { Text, TouchableOpacity, Platform } from 'react-native'
import base64 from 'react-native-base64'
import {
  BleError,
  Characteristic,
  Device,
  ScanOptions
} from 'react-native-ble-plx'
import { ScrollView } from 'react-native-gesture-handler'
import useBLE from '../../hooks/useBle'
import {
  CONTROL_POINT_CHARACTERISTIC_UUID,
  DEVICE_ID,
  HEART_RATE_CHARACTERISTIC_UUID,
  HEART_RATE_SERVICE_UUID,
  SENSOR_LOCATION_CHARACTERISTIC_UUID
} from './index.preset'
import { Input } from './parts/Input'

export const TestPeripheral = () => {
  const [deviceId, setDeviceId] = useState(DEVICE_ID)
  const [serviceId, setServiceId] = useState(HEART_RATE_SERVICE_UUID)
  const [readCharacteristicId, setReadCharacteristicId] = useState(
    SENSOR_LOCATION_CHARACTERISTIC_UUID
  )
  const [writeCharacteristicId, setWriteCharacteristicId] = useState(
    CONTROL_POINT_CHARACTERISTIC_UUID
  )
  const [notifyCharacteristicId, setNotifyCharacteristicId] = useState(
    HEART_RATE_CHARACTERISTIC_UUID
  )
  const [readValue, setReadValue] = useState('')
  const [observableValue, setObservableValue] = useState('')
  const [writeValue, setWriteValue] = useState('')

  const [device, setDevice] = useState<Device | null>(null)
  const { bleManager } = useBLE()

  const onHeartRateUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.log('Error:', error)
      return -1
    } else if (!characteristic?.value) {
      console.log('No Data was recieved')
      return -1
    }
    const value = characteristic.value
    const decodedValue = base64.decode(value)
    setObservableValue(decodedValue)
  }

  const connectToDevice = async (id: string) => {
    try {
      console.log('connecting to device')

      const deviceConnection = await bleManager.connectToDevice(id)
      setDevice(deviceConnection)
      await deviceConnection.discoverAllServicesAndCharacteristics()
      console.log('device connected', deviceConnection.id)

      if (deviceConnection) {
        // notif
        deviceConnection.monitorCharacteristicForService(
          HEART_RATE_SERVICE_UUID,
          HEART_RATE_CHARACTERISTIC_UUID,
          onHeartRateUpdate
        )

        // read
        const char = await deviceConnection.readCharacteristicForService(
          HEART_RATE_SERVICE_UUID,
          SENSOR_LOCATION_CHARACTERISTIC_UUID
        )
        char.value && setReadValue(base64.decode(char.value?.toString()))

        // read
        // const char2 = await deviceConnection.readCharacteristicForService(
        //   HEART_RATE_SERVICE_UUID,
        //   CONTROL_POINT_CHARACTERISTIC_UUID
        // )
        // char2.value && setWriteValue(base64.decode(char2.value?.toString()))
      }
    } catch (e) {
      console.log('FAILED TO CONNECT', e)
    }
  }

  const writeToDevice = async () => {
    const charac = await device?.writeCharacteristicWithResponseForService(
      HEART_RATE_SERVICE_UUID,
      CONTROL_POINT_CHARACTERISTIC_UUID,
      base64.encode(writeValue)
    )
    console.log('writtenValue', charac?.value)
  }

  useFocusEffect(
    useCallback(() => {
      console.log('focus screen')
      void connectToDevice(deviceId)

      return () => {
        console.log('blur screen')
        device?.cancelConnection()
      }
    }, [deviceId])
  )

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Input
        label="observable value"
        value={observableValue}
        editable={false}
      />
      <Input label="read value" value={readValue} editable={false} />
      <Input
        label="write value"
        value={writeValue}
        onChangeText={setWriteValue}
      />
      <TouchableOpacity
        style={{
          backgroundColor: '#ccc',
          padding: 10,
          borderRadius: 5,
          alignSelf: 'center'
        }}
        onPress={writeToDevice}
      >
        <Text
          style={{
            textTransform: 'uppercase'
          }}
        >
          Write
        </Text>
      </TouchableOpacity>
      <Input label="device id" value={deviceId} onChangeText={setDeviceId} />
      <Input label="service id" value={serviceId} onChangeText={setServiceId} />
      <Input
        label="read characteristic id"
        value={readCharacteristicId}
        onChangeText={setReadCharacteristicId}
      />
      <Input
        label="write characteristic id"
        value={writeCharacteristicId}
        onChangeText={setWriteCharacteristicId}
      />
      <Input
        label="notify characteristic id"
        value={notifyCharacteristicId}
        onChangeText={setNotifyCharacteristicId}
      />
    </ScrollView>
  )
}
