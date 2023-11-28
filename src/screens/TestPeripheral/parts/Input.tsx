import { Text, View, TextInput } from 'react-native'

export interface InputProps {
  label: string
  value: string
  onChangeText?: (text: string) => void
  editable?: boolean
}

export const Input = ({ label, value, onChangeText, editable }: InputProps) => (
  <View style={{ paddingVertical: 10 }}>
    <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{label}:</Text>
    <TextInput
      style={{ borderRadius: 5, padding: 10, backgroundColor: '#fff' }}
      onChangeText={onChangeText}
      value={value}
      editable={editable}
    />
  </View>
)
