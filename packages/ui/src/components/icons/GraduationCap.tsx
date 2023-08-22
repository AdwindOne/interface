import type { IconProps } from '@tamagui/helpers-icon'
import { forwardRef, memo } from 'react'
import { Path, Svg } from 'react-native-svg'
import { getTokenValue, isWeb, useTheme } from 'tamagui'

const Icon = forwardRef<Svg, IconProps>((props, ref) => {
  // isWeb currentColor to maintain backwards compat a bit better, on native uses theme color
  const {
    color: colorProp = isWeb ? 'currentColor' : undefined,
    size: sizeProp = '$true',
    strokeWidth: strokeWidthProp,
    ...restProps
  } = props
  const theme = useTheme()

  const size =
    getTokenValue(
      // @ts-expect-error it falls back to undefined
      sizeProp,
      'size'
    ) ?? sizeProp

  const strokeWidth =
    getTokenValue(
      // @ts-expect-error it falls back to undefined
      strokeWidthProp,
      'size'
    ) ?? strokeWidthProp

  const color =
    // @ts-expect-error its fine to access colorProp undefined
    theme[colorProp]?.get() ?? colorProp ?? theme.color.get()

  const svgProps = {
    ...restProps,
    size,
    strokeWidth,
    color,
  }

  return (
    <Svg ref={ref} fill="none" height={size} viewBox="0 0 20 20" width={size} {...svgProps}>
      <Path
        d="M15 12.0158V13.9166C15 14.4949 14.6941 15.0291 14.2049 15.3383C11.4016 17.1091 8.59738 17.1091 5.79405 15.3383C5.30488 15.03 4.99917 14.4949 4.99917 13.9166V12.0158C4.99917 11.9524 5.06662 11.9125 5.12246 11.9425L8.18256 13.6166C8.73256 13.9166 9.36583 14.075 9.99917 14.075C10.6325 14.075 11.2658 13.9166 11.8158 13.6166L14.8759 11.9425C14.9325 11.9117 15 11.9524 15 12.0158ZM16.6142 6.5875L11.2217 3.64499C10.4609 3.22999 9.54074 3.22999 8.77907 3.64499L3.38662 6.5875C2.20495 7.23166 2.20495 8.92833 3.38662 9.57333L8.77907 12.5158C9.53991 12.9308 10.46 12.9308 11.2217 12.5158L16.6142 9.57333L16.0416 9.88583V13.3333C16.0416 13.6783 16.3216 13.9583 16.6666 13.9583C17.0116 13.9583 17.2916 13.6783 17.2916 13.3333V8.89249C17.7116 8.11582 17.4883 7.06416 16.6142 6.5875Z"
        fill={color}
      />
    </Svg>
  )
})

Icon.displayName = 'GraduationCap'

export const GraduationCap = memo<IconProps>(Icon)
