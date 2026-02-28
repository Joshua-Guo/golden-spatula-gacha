import type { Pool, ProbabilityConfig, RarityConfig } from '../types'

// 稀有度配置
export const RARITY_CONFIG: Record<string, RarityConfig> = {
  Mythic: {
    name: '传说',
    color: 'mythic',
    gradient: 'from-red-600 via-red-500 to-red-600',
    borderColor: 'border-red-500',
    textColor: 'text-red-500',
    stonePrice: 600,
    duplicateStoneReward: 300
  },
  Legendary: {
    name: '史诗',
    color: 'legendary',
    gradient: 'from-yellow-500 via-yellow-400 to-yellow-500',
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-500',
    stonePrice: 150,
    duplicateStoneReward: 75
  },
  Special: {
    name: '特殊',
    color: 'special',
    gradient: 'from-orange-500 via-orange-400 to-orange-500',
    borderColor: 'border-orange-500',
    textColor: 'text-orange-500',
    stonePrice: 150,
    duplicateStoneReward: 75
  },
  Epic: {
    name: '稀有',
    color: 'epic',
    gradient: 'from-purple-500 via-purple-400 to-purple-500',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-500',
    stonePrice: 50,
    duplicateStoneReward: 25
  },
  Rare: {
    name: '罕见',
    color: 'rare',
    gradient: 'from-blue-500 via-blue-400 to-blue-500',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-500',
    stonePrice: 20,
    duplicateStoneReward: 10
  },
  Uncommon: {
    name: ' uncommon',
    color: 'uncommon',
    gradient: 'from-green-500 via-green-400 to-green-500',
    borderColor: 'border-green-500',
    textColor: 'text-green-500',
    stonePrice: 10,
    duplicateStoneReward: 5
  },
  Common: {
    name: '普通',
    color: 'common',
    gradient: 'from-gray-400 via-gray-300 to-gray-400',
    borderColor: 'border-gray-400',
    textColor: 'text-gray-400',
    stonePrice: 0,
    duplicateStoneReward: 0
  }
}

// 概率配置 (总和 = 100%) - 提高爆率版本
export const PROBABILITY_CONFIG: ProbabilityConfig[] = [
  { rarity: 'Mythic', probability: 0.50 },    // 0.01% → 0.50% (提高 50 倍)
  { rarity: 'Legendary', probability: 1.00 }, // 0.30% → 1.00% (提高 3 倍)
  { rarity: 'Special', probability: 2.00 },   // 0.60% → 2.00% (提高 3 倍)
  { rarity: 'Epic', probability: 8.00 },      // 5.00% → 8.00% (提高 1.6 倍)
  { rarity: 'Rare', probability: 12.00 },     // 7.00% → 12.00% (提高 1.7 倍)
  { rarity: 'Uncommon', probability: 18.00 }, // 14.40% → 18.00%
  { rarity: 'Common', probability: 58.50 }    // 72.69% → 58.50% (降低，给其他稀有度让位)
]

// 卡池数据
export const POOLS: Pool[] = [
  {
    id: 'jade-sword',
    name: '玉剑传说',
    nameEn: 'Jade Sword',
    themeColor: 'cyan',
    gradient: 'from-cyan-600 via-green-500 to-cyan-600',
    icon: '⚔️',
    description: '玉剑传说系列，仙气飘飘',
    items: [
      // Mythic
      { id: 'js-mythic-1', name: '龙驹仙尊', rarity: 'Mythic', icon: '🐉', poolId: 'jade-sword', description: '玉剑传说至高存在' },
      // Legendary
      { id: 'js-legendary-1', name: '青钢影', rarity: 'Legendary', icon: '🗡️', poolId: 'jade-sword' },
      { id: 'js-legendary-2', name: '艾瑞莉娅', rarity: 'Legendary', icon: '💃', poolId: 'jade-sword' },
      // Special
      { id: 'js-special-1', name: '玉剑使者', rarity: 'Special', icon: '🧚', poolId: 'jade-sword' },
      // Epic
      { id: 'js-epic-1', name: '御剑师', rarity: 'Epic', icon: '🧙', poolId: 'jade-sword' },
      { id: 'js-epic-2', name: '剑客', rarity: 'Epic', icon: '⚔️', poolId: 'jade-sword' },
      // Rare
      { id: 'js-rare-1', name: '剑侍', rarity: 'Rare', icon: '🥷', poolId: 'jade-sword' },
      { id: 'js-rare-2', name: '修仙者', rarity: 'Rare', icon: '🧘', poolId: 'jade-sword' },
      // Uncommon
      { id: 'js-uncommon-1', name: '剑童', rarity: 'Uncommon', icon: '👦', poolId: 'jade-sword' },
      { id: 'js-uncommon-2', name: '小仙', rarity: 'Uncommon', icon: '🧚', poolId: 'jade-sword' },
      { id: 'js-uncommon-3', name: '剑灵', rarity: 'Uncommon', icon: '👻', poolId: 'jade-sword' }
    ]
  },
  {
    id: 'red-chamber',
    name: '迴梦红楼',
    nameEn: 'Red Chamber',
    themeColor: 'red',
    gradient: 'from-red-600 via-pink-500 to-red-600',
    icon: '🌸',
    description: '红楼梦境，唯美浪漫',
    items: [
      // Mythic
      { id: 'rc-mythic-1', name: '林黛玉', rarity: 'Mythic', icon: '🌸', poolId: 'red-chamber', description: '潇湘妃子' },
      // Legendary
      { id: 'rc-legendary-1', name: '贾宝玉', rarity: 'Legendary', icon: '💎', poolId: 'red-chamber' },
      { id: 'rc-legendary-2', name: '薛宝钗', rarity: 'Legendary', icon: '🦋', poolId: 'red-chamber' },
      // Special
      { id: 'rc-special-1', name: '王熙凤', rarity: 'Special', icon: '👑', poolId: 'red-chamber' },
      // Epic
      { id: 'rc-epic-1', name: '史湘云', rarity: 'Epic', icon: '🌺', poolId: 'red-chamber' },
      { id: 'rc-epic-2', name: '贾探春', rarity: 'Epic', icon: '🎋', poolId: 'red-chamber' },
      // Rare
      { id: 'rc-rare-1', name: '妙玉', rarity: 'Rare', icon: '🍵', poolId: 'red-chamber' },
      { id: 'rc-rare-2', name: '迎春', rarity: 'Rare', icon: '🌼', poolId: 'red-chamber' },
      // Uncommon
      { id: 'rc-uncommon-1', name: '惜春', rarity: 'Uncommon', icon: '🎨', poolId: 'red-chamber' },
      { id: 'rc-uncommon-2', name: '李纨', rarity: 'Uncommon', icon: '📖', poolId: 'red-chamber' },
      { id: 'rc-uncommon-3', name: '秦可卿', rarity: 'Uncommon', icon: '🌙', poolId: 'red-chamber' }
    ]
  },
  {
    id: 'five-blessings',
    name: '五福临门',
    nameEn: 'Five Blessings',
    themeColor: 'gold',
    gradient: 'from-red-600 via-yellow-500 to-red-600',
    icon: '🧧',
    description: '新春贺岁，五福临门',
    items: [
      // Mythic
      { id: 'fb-mythic-1', name: '姻缘喜神阿狸', rarity: 'Mythic', icon: '🦊', poolId: 'five-blessings', description: '带来幸福的九尾狐' },
      // Legendary
      { id: 'fb-legendary-1', name: '财神爷', rarity: 'Legendary', icon: '💰', poolId: 'five-blessings' },
      { id: 'fb-legendary-2', name: '福禄寿', rarity: 'Legendary', icon: '👴', poolId: 'five-blessings' },
      // Special
      { id: 'fb-special-1', name: '灶王爷', rarity: 'Special', icon: '🔥', poolId: 'five-blessings' },
      // Epic
      { id: 'fb-epic-1', name: '门神', rarity: 'Epic', icon: '🚪', poolId: 'five-blessings' },
      { id: 'fb-epic-2', name: '年兽', rarity: 'Epic', icon: '🦁', poolId: 'five-blessings' },
      // Rare
      { id: 'fb-rare-1', name: '福娃', rarity: 'Rare', icon: '👶', poolId: 'five-blessings' },
      { id: 'fb-rare-2', name: '春神', rarity: 'Rare', icon: '🌱', poolId: 'five-blessings' },
      // Uncommon
      { id: 'fb-uncommon-1', name: '灯笼精灵', rarity: 'Uncommon', icon: '🏮', poolId: 'five-blessings' },
      { id: 'fb-uncommon-2', name: '鞭炮小子', rarity: 'Uncommon', icon: '🧨', poolId: 'five-blessings' },
      { id: 'fb-uncommon-3', name: '饺子宝宝', rarity: 'Uncommon', icon: '🥟', poolId: 'five-blessings' }
    ]
  },
  {
    id: 'moon-child',
    name: '月华之子',
    nameEn: 'Moon Child',
    themeColor: 'indigo',
    gradient: 'from-indigo-600 via-purple-500 to-indigo-600',
    icon: '🌙',
    description: '月光之下，神秘力量',
    items: [
      // Mythic
      { id: 'mc-mythic-1', name: '厄斐琉斯', rarity: 'Mythic', icon: '🌙', poolId: 'moon-child', description: '皎月教派的信徒' },
      // Legendary
      { id: 'mc-legendary-1', name: '黛安娜', rarity: 'Legendary', icon: '🌑', poolId: 'moon-child' },
      { id: 'mc-legendary-2', name: '雷恩加尔', rarity: 'Legendary', icon: '🦁', poolId: 'moon-child' },
      // Special
      { id: 'mc-special-1', name: '塔里克', rarity: 'Special', icon: '💎', poolId: 'moon-child' },
      // Epic
      { id: 'mc-epic-1', name: '索拉卡', rarity: 'Epic', icon: '⭐', poolId: 'moon-child' },
      { id: 'mc-epic-2', name: '卡尔玛', rarity: 'Epic', icon: '☯️', poolId: 'moon-child' },
      // Rare
      { id: 'mc-rare-1', name: '易大师', rarity: 'Rare', icon: '⚔️', poolId: 'moon-child' },
      { id: 'mc-rare-2', name: '申', rarity: 'Rare', icon: '🥷', poolId: 'moon-child' },
      // Uncommon
      { id: 'mc-uncommon-1', name: '凯南', rarity: 'Uncommon', icon: '⚡', poolId: 'moon-child' },
      { id: 'mc-uncommon-2', name: '李青', rarity: 'Uncommon', icon: '🦶', poolId: 'moon-child' },
      { id: 'mc-uncommon-3', name: '劫', rarity: 'Uncommon', icon: '🥷', poolId: 'moon-child' }
    ]
  }
]

// 辅助函数：根据稀有度获取物品
export function getItemsByRarity(rarity: string): Array<{ id: string; name: string; icon: string; poolId: string }> {
  const items: Array<{ id: string; name: string; icon: string; poolId: string }> = []
  POOLS.forEach(pool => {
    pool.items.forEach(item => {
      if (item.rarity === rarity) {
        items.push({
          id: item.id,
          name: item.name,
          icon: item.icon,
          poolId: pool.id
        })
      }
    })
  })
  return items
}

// 辅助函数：根据 ID 获取物品
export function getItemById(id: string): any {
  for (const pool of POOLS) {
    const item = pool.items.find(i => i.id === id)
    if (item) {
      return item
    }
  }
  return null
}
