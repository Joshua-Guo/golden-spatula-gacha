import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GachaResult, Item } from '../types'
import { POOLS, PROBABILITY_CONFIG, RARITY_CONFIG, getItemById } from '../constants/pools'

// 生成所有非 Common 物品的奖池
const NON_COMMON_ITEMS: Item[] = []
POOLS.forEach(pool => {
  pool.items.forEach(item => {
    if (item.rarity !== 'Common') {
      NON_COMMON_ITEMS.push(item)
    }
  })
})

// 按稀有度分组
const ITEMS_BY_RARITY: Record<string, Item[]> = {}
NON_COMMON_ITEMS.forEach(item => {
  if (!ITEMS_BY_RARITY[item.rarity]) {
    ITEMS_BY_RARITY[item.rarity] = []
  }
  ITEMS_BY_RARITY[item.rarity].push(item)
})

export const useUserStore = defineStore('user', () => {
  // 状态
  const spinsRemaining = ref<number>(60)
  const prismaticStones = ref<number>(0)
  const inventory = ref<string[]>([]) // 已拥有的物品 ID
  const gachaHistory = ref<GachaResult[]>([])
  const redeemedCodes = ref<Record<string, number>>({}) // 已兑换的兑换码及次数

  // 计算属性
  const maxSpins = computed(() => 60)
  const hasSpinsRemaining = computed(() => spinsRemaining.value > 0)

  // 统计信息
  const totalSpins = computed(() => maxSpins.value - spinsRemaining.value)
  
  // 计算总价值（基于物品价格）
  const totalValue = computed(() => {
    let value = 0
    gachaHistory.value.forEach(result => {
      if (result.item.rarity !== 'Common') {
        const config = RARITY_CONFIG[result.item.rarity]
        // 如果是新物品，算全价；如果是重复的，算石头价值
        if (!result.isDuplicate) {
          value += config.stonePrice
        } else {
          value += result.stonesObtained
        }
      } else {
        value += result.stonesObtained
      }
    })
    return value
  })
  
  // 平均价值
  const averageValue = computed(() => {
    if (totalSpins.value === 0) return 0
    return Math.round(totalValue.value / totalSpins.value)
  })
  
  // 评价
  const gachaRating = computed(() => {
    if (totalSpins.value === 0) return { title: '未抽奖', emoji: '🎲', color: 'text-gray-400' }
    
    // 计算欧气值（总价值 / 理论最大值）
    const theoreticalMax = totalSpins.value * 600 // 假设每次都抽到传说
    const luckRatio = totalValue.value / theoreticalMax
    
    if (luckRatio > 0.5) return { title: '超级大欧皇', emoji: '👑', color: 'text-yellow-400' }
    if (luckRatio > 0.3) return { title: '欧皇', emoji: '✨', color: 'text-purple-400' }
    if (luckRatio > 0.15) return { title: '普通人', emoji: '😐', color: 'text-blue-400' }
    if (luckRatio > 0.05) return { title: '非酋', emoji: '😭', color: 'text-orange-400' }
    return { title: '超级大非酋', emoji: '💀', color: 'text-red-400' }
  })
  
  // 最值钱的 Top 5
  const top5Items = computed(() => {
    const items = gachaHistory.value
      .filter(r => r.item.rarity !== 'Common')
      .map(result => {
        const config = RARITY_CONFIG[result.item.rarity]
        const value = result.isDuplicate ? result.stonesObtained : config.stonePrice
        return {
          ...result.item,
          value,
          isDuplicate: result.isDuplicate
        }
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
    
    return items
  })

  // 辅助函数：随机数生成
  function getRandomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min
  }

  function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  // 根据概率抽取稀有度
  function rollRarity(): string {
    const roll = Math.random() * 100 // 0-100
    
    let cumulative = 0
    for (const config of PROBABILITY_CONFIG) {
      cumulative += config.probability
      if (roll < cumulative) {
        return config.rarity
      }
    }
    
    // 默认返回 Common
    return 'Common'
  }

  // 从指定稀有度中随机抽取一个物品
  function rollItemFromRarity(rarity: string): Item | null {
    const items = ITEMS_BY_RARITY[rarity]
    if (!items || items.length === 0) {
      return null
    }
    const randomIndex = getRandomInt(0, items.length - 1)
    return items[randomIndex]
  }

  // 检查物品是否已拥有
  function ownsItem(itemId: string): boolean {
    return inventory.value.includes(itemId)
  }

  // 执行单次抽奖
  function pullOnce(): GachaResult {
    // 检查剩余次数
    if (spinsRemaining.value <= 0) {
      throw new Error('没有剩余抽奖次数')
    }

    // 减少抽奖次数
    spinsRemaining.value--

    // 1. 抽取稀有度
    const rarity = rollRarity()

    // 2. 如果是 Common，直接给石头
    if (rarity === 'Common') {
      const stonesAmount = getRandomInt(1, 3)
      prismaticStones.value += stonesAmount
      
      // 创建一个虚拟的 Common 物品结果
      const commonResult: GachaResult = {
        item: {
          id: 'common-stone',
          name: '棱彩兑换石',
          rarity: 'Common',
          icon: '💎',
          poolId: 'common'
        },
        isDuplicate: false,
        stonesObtained: stonesAmount
      }
      
      gachaHistory.value.unshift(commonResult)
      return commonResult
    }

    // 3. 抽取具体物品
    const item = rollItemFromRarity(rarity)
    if (!item) {
      // 如果没有抽到物品（理论上不会发生），返还石头
      const stonesAmount = getRandomInt(1, 3)
      prismaticStones.value += stonesAmount
      
      const fallbackResult: GachaResult = {
        item: {
          id: 'fallback-stone',
          name: '棱彩兑换石',
          rarity: 'Common',
          icon: '💎',
          poolId: 'common'
        },
        isDuplicate: false,
        stonesObtained: stonesAmount
      }
      
      gachaHistory.value.unshift(fallbackResult)
      return fallbackResult
    }

    // 4. 检查是否重复
    const isDuplicate = ownsItem(item.id)
    let stonesObtained = 0

    if (isDuplicate) {
      // 重复物品：转化为石头（稀有度价格的一半）
      const rarityConfig = RARITY_CONFIG[item.rarity]
      stonesObtained = rarityConfig.duplicateStoneReward
      prismaticStones.value += stonesObtained
    } else {
      // 新物品：加入背包
      inventory.value.push(item.id)
    }

    // 5. 创建结果
    const result: GachaResult = {
      item,
      isDuplicate,
      stonesObtained
    }

    // 6. 添加到历史记录
    gachaHistory.value.unshift(result)

    return result
  }

  // 执行十连抽
  function pullTenTimes(): GachaResult[] {
    const results: GachaResult[] = []
    
    for (let i = 0; i < 10; i++) {
      // 如果中途没有次数了，停止
      if (spinsRemaining.value <= 0) {
        break
      }
      results.push(pullOnce())
    }
    
    return results
  }

  // 兑换物品
  function exchangeItem(itemId: string): boolean {
    const item = getItemById(itemId)
    if (!item) {
      return false
    }

    // 检查是否已拥有
    if (ownsItem(itemId)) {
      return false
    }

    // 检查价格
    const rarityConfig = RARITY_CONFIG[item.rarity]
    const price = rarityConfig.stonePrice

    // 检查石头是否足够
    if (prismaticStones.value < price) {
      return false
    }

    // 扣除石头
    prismaticStones.value -= price
    
    // 加入背包
    inventory.value.push(itemId)

    return true
  }

  // 兑换码兑换
  function redeemCode(code: string): { success: boolean; message: string; reward?: { spins: number } } {
    const normalizedCode = code.trim()
    
    // 检查兑换码
    if (normalizedCode === '主任真帅') {
      // 增加抽奖次数（可重复领取）
      const rewardSpins = 100
      spinsRemaining.value += rewardSpins
      
      // 记录兑换次数
      if (!redeemedCodes.value[normalizedCode]) {
        redeemedCodes.value[normalizedCode] = 0
      }
      redeemedCodes.value[normalizedCode]++
      
      return {
        success: true,
        message: `兑换成功！获得 ${rewardSpins} 次抽奖机会！`,
        reward: { spins: rewardSpins }
      }
    }
    
    return {
      success: false,
      message: '无效的兑换码'
    }
  }

  // 重置状态
  function reset() {
    spinsRemaining.value = 60
    prismaticStones.value = 0
    inventory.value = []
    gachaHistory.value = []
    redeemedCodes.value = {}
  }

  return {
    // 状态
    spinsRemaining,
    prismaticStones,
    inventory,
    gachaHistory,
    redeemedCodes,
    maxSpins,
    hasSpinsRemaining,
    
    // 统计信息
    totalSpins,
    totalValue,
    averageValue,
    gachaRating,
    top5Items,
    
    // 方法
    pullOnce,
    pullTenTimes,
    exchangeItem,
    ownsItem,
    redeemCode,
    reset
  }
})
