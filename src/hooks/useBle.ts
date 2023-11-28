import { useMemo } from 'react'
import { BleManager } from 'react-native-ble-plx'
import { PermissionsAndroid, Platform } from 'react-native'
import * as ExpoDevice from 'expo-device'

interface BluetoothLowEnergyApi {
  bleManager: BleManager
  requestPermissions: () => Promise<boolean>
}

export default function useBLE(): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), [])

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: 'Location Permission',
        message: 'Bluetooth Low Energy requires Location',
        buttonPositive: 'OK'
      }
    )
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: 'Location Permission',
        message: 'Bluetooth Low Energy requires Location',
        buttonPositive: 'OK'
      }
    )
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'Bluetooth Low Energy requires Location',
        buttonPositive: 'OK'
      }
    )

    return (
      bluetoothScanPermission === 'granted' &&
      bluetoothConnectPermission === 'granted' &&
      fineLocationPermission === 'granted'
    )
  }

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Bluetooth Low Energy requires Location',
            buttonPositive: 'OK'
          }
        )
        return granted === PermissionsAndroid.RESULTS.GRANTED
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions()

        return isAndroid31PermissionsGranted
      }
    } else {
      return true
    }
  }

  return {
    bleManager,
    requestPermissions
  }
}
