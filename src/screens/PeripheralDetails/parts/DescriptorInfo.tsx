import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import base64 from 'react-native-base64'
import { Descriptor } from 'react-native-ble-plx'

export const DescriptorInfo = ({ descriptor }: { descriptor: Descriptor }) => {
  const [value, setValue] = useState<string | null>(null)

  const readDescriptor = async () => {
    const desc = await descriptor.read()
    const decodedValue = desc.value ? base64.decode(desc.value) : null
    setValue(decodedValue)
  }
  useEffect(() => {
    void readDescriptor()
  }, [descriptor])

  return (
    <View
      style={{
        marginVertical: 5,
        backgroundColor: '#aaa',
        padding: 10,
        borderRadius: 5
      }}
    >
      <Text>
        <Text style={{ fontWeight: 'bold' }}>id: </Text>
        {descriptor.id}
      </Text>
      <Text>
        <Text style={{ fontWeight: 'bold' }}>uuid: </Text>
        {descriptor.uuid}
      </Text>
      <Text>
        <Text style={{ fontWeight: 'bold' }}>value: </Text>
        {value}
      </Text>
    </View>
  )
}
