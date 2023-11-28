import { Characteristic, Service } from 'react-native-ble-plx'
import { Text, View } from 'react-native'
import { useEffect, useState } from 'react'
import { CharacteristicInfo } from './CharacteristicInfo'
import { TextToCopy } from '../../../components/TextToCopy'

export const ServiceInfo = ({ service }: { service: Service }) => {
  const [characteristics, setCharacteristics] = useState<Characteristic[]>()
  const fetchCharacteristics = async () => {
    try {
      const result = await service.characteristics()
      setCharacteristics(result)
    } catch (error) {
      console.log('FAILED TO FETCH CHARACTERISTICS', error)
    }
  }

  useEffect(() => {
    void fetchCharacteristics()
  }, [service])

  return (
    <View
      style={{
        marginVertical: 10,
        backgroundColor: '#ddd',
        padding: 10,
        borderRadius: 5
      }}
    >
      <Text>
        <Text style={{ fontWeight: 'bold' }}>id: </Text>
        {service.id}
      </Text>
      <Text>
        <Text style={{ fontWeight: 'bold' }}>uuid: </Text>
        <TextToCopy>{service.uuid}</TextToCopy>
      </Text>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 16,
          marginTop: 10,
          marginBottom: 5
        }}
      >
        characteristics:
      </Text>
      <View style={{ paddingLeft: 20 }}>
        {characteristics?.map(char => (
          <CharacteristicInfo key={char.id} characteristic={char} />
        ))}
      </View>
    </View>
  )
}
