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
  const pityCounter = ref<number>(0) // 保底计数器（记录未中神话的抽数）
  const lifetimeSpins = ref<number>(0) // 历史总抽奖次数（永久累积）

  // 计算属性
  const maxSpins = computed(() => 60)
  const hasSpinsRemaining = computed(() => spinsRemaining.value > 0)

  // 统计信息
  const totalSpins = computed(() => lifetimeSpins.value) // 使用历史总次数
  
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
  
  // 评价（12 个等级）- 宽松版本（降低要求）
  const gachaRating = computed(() => {
    if (totalSpins.value === 0) return { title: '未抽奖', emoji: '🎲', color: 'text-gray-400' }
    
    // 计算欧气值（总价值 / 理论最大值）
    const theoreticalMax = totalSpins.value * 600 // 假设每次都抽到传说
    const luckRatio = totalValue.value / theoreticalMax
    
    // 计算保底效率（实际获得神话数 / 理论保底神话数）
    const mythicCount = gachaHistory.value.filter(r => r.item.rarity === 'Mythic' && !r.isDuplicate).length
    const expectedMythics = Math.floor(totalSpins.value / 100) // 每 100 抽保底一个神话
    const pityEfficiency = expectedMythics > 0 ? mythicCount / expectedMythics : mythicCount
    
    // 12 个评价等级 - 大幅降低要求
    if (luckRatio >= 0.25 || pityEfficiency >= 2) return { title: '鸿蒙欧帝', emoji: '🌌', color: 'text-red-500' }
    if (luckRatio >= 0.20 || pityEfficiency >= 1.5) return { title: '太乙欧圣', emoji: '☯️', color: 'text-purple-400' }
    if (luckRatio >= 0.18 || pityEfficiency >= 1.3) return { title: '超级大欧皇', emoji: '👑', color: 'text-yellow-400' }
    if (luckRatio >= 0.16 || pityEfficiency >= 1.2) return { title: '天命欧皇', emoji: '🐲', color: 'text-orange-400' }
    if (luckRatio >= 0.14 || pityEfficiency >= 1.1) return { title: '欧皇', emoji: '✨', color: 'text-yellow-500' }
    if (luckRatio >= 0.12) return { title: '欧气满满', emoji: '🌟', color: 'text-green-400' }
    if (luckRatio >= 0.10) return { title: '小欧', emoji: '😊', color: 'text-blue-300' }
    if (luckRatio >= 0.08) return { title: '普通人', emoji: '😐', color: 'text-blue-400' }
    if (luckRatio >= 0.06) return { title: '小非', emoji: '😅', color: 'text-yellow-600' }
    if (luckRatio >= 0.04) return { title: '非酋', emoji: '😭', color: 'text-orange-500' }
    if (luckRatio >= 0.02) return { title: '超级非酋', emoji: '💔', color: 'text-red-400' }
    return { title: '超级大非酋', emoji: '💀', color: 'text-red-600' }
  })
    if (luckRatio >= 0.05) return { title: '超级非酋', emoji: '💔', color: 'text-red-400' }
    return { title: '超级大非酋', emoji: '💀', color: 'text-red-600' }
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

  // 根据概率抽取稀有度（带保底机制）
  function rollRarity(): string {
    pityCounter.value++
    
    // 保底机制：100 抽内必出神话
    if (pityCounter.value >= 100) {
      pityCounter.value = 0 // 重置保底
      return 'Mythic'
    }
    
    const roll = Math.random() * 100 // 0-100
    
    let cumulative = 0
    for (const config of PROBABILITY_CONFIG) {
      cumulative += config.probability
      if (roll < cumulative) {
        const rarity = config.rarity
        
        // 如果中了神话，重置保底
        if (rarity === 'Mythic') {
          pityCounter.value = 0
        }
        
        return rarity
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
    
    // 增加历史总抽奖次数
    lifetimeSpins.value++

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

  // 重置状态（不重置历史统计）
  function reset() {
    spinsRemaining.value = 60
    prismaticStones.value = 0
    inventory.value = []
    gachaHistory.value = []
    redeemedCodes.value = {}
    pityCounter.value = 0 // 重置保底计数器
    // lifetimeSpins.value 保持不变，不重置历史总次数
  }

  return {
    // 状态
    spinsRemaining,
    prismaticStones,
    inventory,
    gachaHistory,
    redeemedCodes,
    pityCounter, // 保底计数器
    lifetimeSpins, // 历史总抽奖次数
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
