import { default as React } from 'react'
import { Image, ImageStyle } from 'react-native'
import { useAppDispatch } from 'src/app/hooks'
import { Button } from 'src/components/buttons/Button'
import { Flex } from 'src/components/layout'
import { Text } from 'src/components/Text'
import { useTokenDetailsNavigation } from 'src/components/TokenDetails/hooks'
import { CoingeckoMarketCoin, CoingeckoSearchCoin } from 'src/features/dataApi/coingecko/types'
import {
  addToSearchHistory,
  SearchResultType,
  TokenSearchResult,
} from 'src/features/explore/searchHistorySlice'
import { ElementName } from 'src/features/telemetry/constants'
import { useCurrencyIdFromCoingeckoId } from 'src/features/tokens/useCurrency'

type SearchTokenItemProps = {
  coin: CoingeckoSearchCoin | CoingeckoMarketCoin | TokenSearchResult
}

export const TOKEN_SUBHEAD_ROW_HEIGHT = 20

export function SearchTokenItem({ coin }: SearchTokenItemProps) {
  const dispatch = useAppDispatch()
  const _currencyId = useCurrencyIdFromCoingeckoId(coin.id)

  const tokenDetailsNavigation = useTokenDetailsNavigation()

  if (!_currencyId) return null

  const { id, name, symbol } = coin
  const uri =
    (coin as CoingeckoSearchCoin).large ||
    (coin as CoingeckoMarketCoin).image ||
    (coin as TokenSearchResult).image

  const onPress = () => {
    dispatch(
      addToSearchHistory({
        searchResult: { type: SearchResultType.Token, id, name, symbol, image: uri },
      })
    )
    tokenDetailsNavigation.navigate(_currencyId)
  }

  return (
    <Button
      name={ElementName.SearchTokenItem}
      onPress={onPress}
      onPressIn={() => {
        tokenDetailsNavigation.preload(_currencyId)
      }}>
      <Flex row alignItems="center" gap="xs" px="xs" py="sm">
        <Image source={{ uri }} style={logoStyle} />
        <Flex gap="none">
          <Text color="textPrimary" variant="subhead">
            {name}
          </Text>
          <Flex row height={TOKEN_SUBHEAD_ROW_HEIGHT}>
            <Text color="textSecondary" variant="caption">
              {symbol.toUpperCase() ?? ''}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Button>
  )
}

export const logoStyle: ImageStyle = {
  height: 32,
  resizeMode: 'cover',
  width: 32,
}
