import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs'
import React from 'react'
import { useAppTheme } from 'src/app/hooks'
import SearchIcon from 'src/assets/icons/search.svg'
import SwapIcon from 'src/assets/icons/swap.svg'
import WalletIcon from 'src/assets/icons/wallet.svg'
import { IconButton } from 'src/components/buttons/IconButton'
import { ElementName } from 'src/features/telemetry/constants'

export function SwapButton(props: BottomTabBarButtonProps) {
  return (
    <IconButton
      icon={<SwapIcon fill="white" height={24} width={24} />}
      mb="sm"
      name={ElementName.TabBarSwap}
      testID={ElementName.TabBarSwap}
      variant="primary"
      onPress={props.onPress}
    />
  )
}

interface NavIconProps {
  focused: boolean
}

export function WalletTabIcon({ focused }: NavIconProps) {
  const { primaryColor, secondaryColor } = useTabNavColors()
  return <WalletIcon fill={focused ? primaryColor : secondaryColor} height={30} width={30} />
}

export function ExploreTabIcon({ focused }: NavIconProps) {
  const { primaryColor, secondaryColor } = useTabNavColors()
  return (
    <SearchIcon
      height={30}
      stroke={focused ? primaryColor : secondaryColor}
      strokeWidth={2.2}
      width={30}
    />
  )
}

function useTabNavColors() {
  const theme = useAppTheme()
  const primaryColor = theme.colors.primary1
  const secondaryColor = theme.colors.secondary2
  return { primaryColor, secondaryColor }
}
