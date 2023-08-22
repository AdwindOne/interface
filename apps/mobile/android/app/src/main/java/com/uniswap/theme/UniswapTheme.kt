package com.uniswap.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material.MaterialTheme
import androidx.compose.material.ProvideTextStyle
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.remember

@Composable
fun UniswapTheme(
  darkTheme: Boolean = isSystemInDarkTheme(),
  content: @Composable () -> Unit
) {
  val customSpacing = CustomSpacing()
  val customTypography = CustomTypography()
  val customShapes = CustomShapes()
  val customColors = remember {
    if (darkTheme) darkCustomColors else lightCustomColors
  }

  CompositionLocalProvider(
    LocalCustomSpacing provides customSpacing,
    LocalCustomTypography provides customTypography,
    LocalCustomShapes provides customShapes,
    LocalCustomColors provides customColors,
  ) {
    MaterialTheme(
      colors = if (darkTheme) DarkColors else LightColors
    ) {
      ProvideTextStyle(value = customTypography.bodyLarge) {
        content()
      }
    }
  }
}

object UniswapTheme {
  val spacing: CustomSpacing
    @Composable
    get() = LocalCustomSpacing.current

  val typography: CustomTypography
    @Composable
    get() = LocalCustomTypography.current

  val shapes: CustomShapes
    @Composable
    get() = LocalCustomShapes.current

  val colors: CustomColors
    @Composable
    get() = LocalCustomColors.current
}
