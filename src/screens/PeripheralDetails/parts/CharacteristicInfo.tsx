import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import base64 from 'react-native-base64'
import { Characteristic, Descriptor } from 'react-native-ble-plx'
import { TextToCopy } from '../../../components/TextToCopy'
import { DescriptorInfo } from './DescriptorInfo'

export const CharacteristicInfo = ({
  characteristic
}: {
  characteristic: Characteristic
}) => {
  const [descriptors, setDescriptors] = useState<Descriptor[]>()
  const [value, setValue] = useState<string | null>(null)

  const fetchDescriptors = async () => {
    try {
      const result = await characteristic.descriptors()
      setDescriptors(result)
    } catch (error) {
      console.log('FAILED TO FETCH DESCRIPTORS', error)
    }
  }

  const readValue = async () => {
    try {
      if (!characteristic.isReadable) return
      const char = await characteristic.read()
      const decodedValue = char.value ? base64.decode(char.value) : null
      setValue(decodedValue)
    } catch (error) {
      console.log('FAILED TO READ VALUE', error)
    }
  }

  useEffect(() => {
    void fetchDescriptors()
    void readValue()
  }, [characteristic])

  return (
    <View
      style={{
        marginVertical: 5,
        backgroundColor: '#ccc',
        padding: 10,
        borderRadius: 5
      }}
    >
      <Text>
        <Text style={{ fontWeight: 'bold' }}>id: </Text>
        {characteristic.id}
      </Text>
      <Text>
        <Text style={{ fontWeight: 'bold' }}>uuid: </Text>
        <TextToCopy>{characteristic.uuid}</TextToCopy>
      </Text>
      <Text>
        <Text style={{ fontWeight: 'bold' }}>value: </Text>
        {value}
      </Text>
      <Text style={{ fontWeight: 'bold' }}>descriptors:</Text>
      <View style={{ paddingLeft: 20 }}>
        {descriptors?.map(descriptor => (
          <DescriptorInfo key={descriptor.id} descriptor={descriptor} />
        ))}
      </View>
    </View>
  )
}
