import { ZERO_BD, ZERO_BI, ONE_BI } from './constants'
/* eslint-disable prefer-const */
import {
  UniswapData,
  Factory,
  Pool,
  PoolData,
  Token,
  TokenData,
  Bundle,
  Tick,
  TickData
} from './../types/schema'
import { FACTORY_ADDRESS } from './constants'
import { ethereum } from '@graphprotocol/graph-ts'

/**
 * Tracks global aggregate data over daily windows
 * @param event
 */
export function updateUniswapTimeseries(): UniswapData {
  let uniswap = Factory.load(FACTORY_ADDRESS)!
  
  let uniswapData = new UniswapData("auto")
  uniswapData.volumeETH = ZERO_BD
  uniswapData.volumeUSD = ZERO_BD
  uniswapData.volumeUSDUntracked = ZERO_BD 
  uniswapData.feesUSD = ZERO_BD
  uniswapData.tvlUSD = uniswap.totalValueLockedUSD
  uniswapData.save()
  return uniswapData as UniswapData
}

export function updatePoolTimeseries(event: ethereum.Event): PoolData {
  let pool = Pool.load(event.address)!
  
  let poolData = new PoolData("auto")
  poolData.pool = pool.id
  poolData.liquidity = pool.liquidity
  poolData.sqrtPrice = pool.sqrtPrice
  poolData.token0Price = pool.token0Price
  poolData.token1Price = pool.token1Price
  poolData.tick = pool.tick
  poolData.feeGrowthGlobal0X128 = pool.feeGrowthGlobal0X128
  poolData.feeGrowthGlobal1X128 = pool.feeGrowthGlobal1X128
  poolData.tvlUSD = pool.totalValueLockedUSD
  poolData.volumeToken0 = ZERO_BD
  poolData.volumeToken1 = ZERO_BD
  poolData.volumeUSD = ZERO_BD
  poolData.feesUSD = ZERO_BD

  poolData.save()

  return poolData as PoolData
}

export function updateTokenTimeseries(token: Token): TokenData {
  let bundle = Bundle.load('1')!

  let tokenTimeseriesData = new TokenData("auto") 
  tokenTimeseriesData.token = token.id
  tokenTimeseriesData.volume = token.volume
  tokenTimeseriesData.volumeUSD = token.volumeUSD
  tokenTimeseriesData.untrackedVolumeUSD = token.untrackedVolumeUSD
  tokenTimeseriesData.totalValueLocked = token.totalValueLocked
  tokenTimeseriesData.totalValueLockedUSD = token.totalValueLockedUSD
  tokenTimeseriesData.priceUSD = token.derivedETH.times(bundle.ethPriceUSD)
  tokenTimeseriesData.feesUSD = token.feesUSD

  tokenTimeseriesData.save()

  return tokenTimeseriesData as TokenData
}

export function updateTickTimeseries(tick: Tick): TickData {
  
  let tickData = new TickData("auto")
  tickData.pool = tick.pool
  tickData.tick = tick.id
  tickData.liquidityGross = tick.liquidityGross
  tickData.liquidityNet = tick.liquidityNet
  tickData.volumeToken0 = tick.volumeToken0
  tickData.volumeToken1 = tick.volumeToken0
  tickData.volumeUSD = tick.volumeUSD
  tickData.feesUSD = tick.feesUSD
  tickData.feeGrowthOutside0X128 = tick.feeGrowthOutside0X128
  tickData.feeGrowthOutside1X128 = tick.feeGrowthOutside1X128

  tickData.save()

  return tickData as TickData
}
