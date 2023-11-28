import { useEffect, useState } from 'react'
import { View, Text, Platform } from 'react-native'
import base64 from 'react-native-base64'
import { BleError, Characteristic, Device } from 'react-native-ble-plx'
import useBLE from '../../hooks/useBle'

const DEVICE_ID =
  Platform.OS === 'android'
    ? 'BC:D0:74:27:FA:6D'
    : 'F8689978-10D9-3BD8-4EA3-DD693CB4F4D5'
const HEART_RATE_SERVICE_UUID = '0000180d-0000-1000-8000-00805f9b34fb'
const HEART_RATE_CHARACTERISTIC_UUID = '00002a37-0000-1000-8000-00805f9b34fb'

export const HeartRate = () => {
  const [heartRateValue, setHeartRateValue] = useState<number | null>(null)
  const { bleManager } = useBLE()

  const convert = (rawData: string) => {
    let innerHeartRate: number = -1
    const firstBitValue: number = Number(rawData) & 0x01

    if (firstBitValue === 0) {
      innerHeartRate = rawData[1].charCodeAt(0)
    } else {
      innerHeartRate =
        Number(rawData[1].charCodeAt(0) << 8) + Number(rawData[2].charCodeAt(2))
    }

    return innerHeartRate
  }

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
    const convertedValue = convert(decodedValue)
    setHeartRateValue(convertedValue)
  }

  const connectToDevice = async (id: string) => {
    try {
      console.log('connecting to device')

      const deviceConnection = await bleManager.connectToDevice(id)
      await deviceConnection.discoverAllServicesAndCharacteristics()
      bleManager.stopDeviceScan()
      console.log('device connected', deviceConnection.id)

      if (deviceConnection) {
        deviceConnection.monitorCharacteristicForService(
          HEART_RATE_SERVICE_UUID,
          HEART_RATE_CHARACTERISTIC_UUID,
          onHeartRateUpdate
        )
      }
    } catch (e) {
      console.log('FAILED TO CONNECT', e)
    }
  }

  useEffect(() => {
    void connectToDevice(DEVICE_ID)
  }, [])

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Text style={{ marginBottom: 20 }}>Your Heart Rate Is:</Text>
      <View
        style={{
          borderRadius: 999,
          borderWidth: 2,
          borderColor: '#ccc',
          justifyContent: 'center',
          alignItems: 'center',
          width: 100,
          height: 100
        }}
      >
        <Text style={{ fontSize: 20 }}>{heartRateValue?.toString()} bpm</Text>
      </View>
    </View>
  )
}
