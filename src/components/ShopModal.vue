<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '../stores/user'
import { POOLS, RARITY_CONFIG, getItemById } from '../constants/pools'
import type { ShopItem } from '../types'

const userStore = useUserStore()

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

// 所有可兑换物品
const allShopItems = computed<ShopItem[]>(() => {
  const items: ShopItem[] = []
  
  POOLS.forEach(pool => {
    pool.items.forEach(item => {
      if (item.rarity !== 'Common') { // Common 不进入商店
        const owned = userStore.ownsItem(item.id)
        const price = RARITY_CONFIG[item.rarity].stonePrice
        items.push({
          item,
          owned,
          canAfford: userStore.prismaticStones >= price,
          price
        })
      }
    })
  })
  
  return items
})

// 已拥有
const ownedItems = computed(() => allShopItems.value.filter(item => item.owned))

// 可兑换（未拥有且买得起）
const availableItems = computed(() => 
  allShopItems.value.filter(item => !item.owned)
)

// 兑换物品
function exchange(item: ShopItem) {
  if (item.owned) return
  
  const success = userStore.exchangeItem(item.item.id)
  if (!success) {
    alert('石头不足或兑换失败')
  }
}

// 按稀有度分组显示
function getItemsByRarity(items: ShopItem[]) {
  const grouped: Record<string, ShopItem[]> = {}
  items.forEach(item => {
    if (!grouped[item.item.rarity]) {
      grouped[item.item.rarity] = []
    }
    grouped[item.item.rarity].push(item)
  })
  return grouped
}

const ownedGrouped = computed(() => getItemsByRarity(ownedItems.value))
const availableGrouped = computed(() => getItemsByRarity(availableItems.value))
</script>

<template>
  <Teleport to="body">
    <Transition name="slide">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm"
        @click="$emit('close')"
      >
        <!-- 侧边栏 -->
        <div
          class="flex h-full w-full max-w-md flex-col overflow-y-auto border-l-2 border-yellow-600/50 bg-gradient-to-b from-slate-900 to-slate-800 p-6"
          @click.stop
        >
          <!-- 标题 -->
          <div class="mb-6 flex items-center justify-between border-b border-yellow-600/30 pb-4">
            <h2 class="text-2xl font-bold text-yellow-400">
              🎒 背包 & 商店
            </h2>
            <button
              @click="$emit('close')"
              class="rounded-full bg-yellow-600/20 px-4 py-2 text-yellow-400 hover:bg-yellow-600/30 transition-colors"
            >
              ✕
            </button>
          </div>

          <!-- 石头数量 -->
          <div class="mb-6 rounded-xl bg-gradient-to-r from-blue-600/20 to-blue-500/20 p-4 text-center">
            <div class="text-3xl font-bold text-blue-400">
              💎 {{ userStore.prismaticStones }}
            </div>
            <div class="text-sm text-blue-300">棱彩兑换石</div>
          </div>

          <!-- 已拥有 -->
          <div class="mb-6">
            <h3 class="mb-3 text-lg font-bold text-green-400">
              ✅ 已拥有 ({{ ownedItems.length }})
            </h3>
            
            <div v-if="ownedItems.length === 0" class="text-center text-gray-500 py-4">
              还没有任何物品
            </div>
            
            <div v-else class="grid grid-cols-3 gap-2">
              <div
                v-for="item in ownedItems"
                :key="item.item.id"
                class="rounded-lg border border-gray-600 bg-slate-800 p-2 text-center"
              >
                <div class="text-2xl">{{ item.item.icon }}</div>
                <div class="text-xs text-gray-400 truncate">{{ item.item.name }}</div>
              </div>
            </div>
          </div>

          <!-- 可兑换 -->
          <div>
            <h3 class="mb-3 text-lg font-bold text-yellow-400">
              🛒 可兑换 ({{ availableItems.length }})
            </h3>

            <div v-if="availableItems.length === 0" class="text-center text-gray-500 py-4">
              所有物品都已拥有
            </div>

            <div v-else class="space-y-4">
              <!-- 按稀有度分组 -->
              <div v-for="(items, rarity) in availableGrouped" :key="rarity">
                <div class="mb-2 flex items-center gap-2">
                  <span
                    class="rounded px-2 py-1 text-xs font-bold text-white"
                    :class="`bg-gradient-to-r ${RARITY_CONFIG[rarity].gradient}`"
                  >
                    {{ RARITY_CONFIG[rarity].name }}
                  </span>
                  <span class="text-xs text-gray-400">({{ items.length }}个)</span>
                </div>

                <div class="grid grid-cols-3 gap-2">
                  <div
                    v-for="shopItem in items"
                    :key="shopItem.item.id"
                    class="group relative overflow-hidden rounded-lg border bg-slate-800 p-2 text-center transition-all hover:scale-105"
                    :class="shopItem.canAfford ? 'border-yellow-600/50' : 'border-gray-700'"
                  >
                    <!-- Emoji -->
                    <div class="text-2xl">{{ shopItem.item.icon }}</div>
                    
                    <!-- 名称 -->
                    <div class="text-xs text-gray-300 truncate">{{ shopItem.item.name }}</div>
                    
                    <!-- 价格 -->
                    <div class="mt-1 flex items-center justify-center gap-1 text-xs"
                         :class="shopItem.canAfford ? 'text-blue-400' : 'text-red-400'">
                      <span>💎</span>
                      <span>{{ shopItem.price }}</span>
                    </div>

                    <!-- 兑换按钮 -->
                    <button
                      v-if="shopItem.canAfford"
                      @click="exchange(shopItem)"
                      class="mt-1 w-full rounded bg-gradient-to-r from-yellow-600 to-yellow-500 py-1 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      兑换
                    </button>
                    <div v-else class="mt-1 text-xs text-red-400">
                      石头不足
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
