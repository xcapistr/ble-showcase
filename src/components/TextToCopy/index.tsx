import { TouchableOpacity } from 'react-native-gesture-handler'
import {
  StyleProp,
  TextComponent,
  TextProps,
  ViewComponent,
  Text,
  ViewStyle,
  TextStyle
} from 'react-native'
import { Children, PropsWithChildren } from 'react'
import Clipboard from '@react-native-community/clipboard'

export interface TextToCopyProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
}

export const TextToCopy = ({ style, textStyle, children }: TextToCopyProps) => {
  const handlePress = () =>
    children && Clipboard.setString(children?.toString())

  return (
    <TouchableOpacity onPress={handlePress} style={style}>
      <Text style={textStyle}>{children}</Text>
    </TouchableOpacity>
  )
}
