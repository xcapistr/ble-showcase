import { useMemo } from 'react'
import { type ColorValue } from 'react-native'
import { type SvgProps } from 'react-native-svg'

import { ICON } from './preset.index'

export type IconName = keyof typeof ICON

interface IIcon extends SvgProps {
  name: IconName
  color?: ColorValue
}

export const Icon = ({ name, color, ...props }: IIcon) => {
  const IconComponent = useMemo(() => ICON[name], [name])

  return <IconComponent color={color} {...props} />
}
