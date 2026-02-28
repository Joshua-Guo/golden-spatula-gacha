// 稀有度枚举
export type Rarity = 'Mythic' | 'Legendary' | 'Special' | 'Epic' | 'Rare' | 'Uncommon' | 'Common'

// 稀有度配置
export interface RarityConfig {
  name: string
  color: string
  gradient: string
  borderColor: string
  textColor: string
  stonePrice: number // 兑换价格
  duplicateStoneReward: number // 重复时获得的石头数（价格的一半）
}

// 物品类型
export interface Item {
  id: string
  name: string
  rarity: Rarity
  icon: string // Emoji
  description?: string
  poolId: string // 所属卡池 ID
}

// 卡池类型
export interface Pool {
  id: string
  name: string
  nameEn: string
  themeColor: string
  gradient: string
  icon: string
  description: string
  items: Item[]
}

// 抽奖结果
export interface GachaResult {
  item: Item
  isDuplicate: boolean // 是否重复
  stonesObtained: number // 如果是重复，获得的石头数
  stonesSpent?: number // 如果消耗石头，记录消耗的石头数
}

// 用户状态
export interface UserState {
  // 抽奖次数
  spinsRemaining: number
  maxSpins: number
  
  // 货币
  prismaticStones: number // 棱彩兑换石
  
  // 背包：记录已拥有的物品 ID
  inventory: string[]
  
  // 历史记录
  gachaHistory: GachaResult[]
}

// 商店兑换项
export interface ShopItem {
  item: Item
  owned: boolean
  canAfford: boolean
  price: number
}

// 稀有度概率配置
export interface ProbabilityConfig {
  rarity: Rarity
  probability: number // 百分比 (0-100)
}
