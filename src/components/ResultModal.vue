<script setup lang="ts">
import { computed } from 'vue'
import type { GachaResult } from '../types'
import { RARITY_CONFIG } from '../constants/pools'

const props = defineProps<{
  results: GachaResult[]
  show: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

// 按稀有度排序（高的在前）
const sortedResults = computed(() => {
  const rarityOrder: Record<string, number> = {
    Mythic: 0,
    Legendary: 1,
    Special: 2,
    Epic: 3,
    Rare: 4,
    Uncommon: 5,
    Common: 6
  }
  
  return [...props.results].sort((a, b) => {
    return rarityOrder[a.item.rarity] - rarityOrder[b.item.rarity]
  })
})

// 统计
const stats = computed(() => {
  const newItems = props.results.filter(r => !r.isDuplicate)
  const stones = props.results.reduce((sum, r) => sum + r.stonesObtained, 0)
  return { newItems: newItems.length, stones }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        @click="$emit('close')"
      >
        <!-- 弹窗内容 -->
        <div
          class="mx-4 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border-2 border-yellow-600/50 bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-2xl"
          @click.stop
        >
          <!-- 标题 -->
          <div class="mb-6 flex items-center justify-between border-b border-yellow-600/30 pb-4">
            <h2 class="text-2xl font-bold text-yellow-400">
              🎉 抽奖结果
            </h2>
            <button
              @click="$emit('close')"
              class="rounded-full bg-yellow-600/20 px-4 py-2 text-yellow-400 hover:bg-yellow-600/30 transition-colors"
            >
              ✕
            </button>
          </div>

          <!-- 统计信息 -->
          <div class="mb-6 flex gap-4">
            <div class="flex-1 rounded-xl bg-green-600/20 p-4 text-center">
              <div class="text-2xl font-bold text-green-400">{{ stats.newItems }}</div>
              <div class="text-sm text-green-300">新物品</div>
            </div>
            <div class="flex-1 rounded-xl bg-blue-600/20 p-4 text-center">
              <div class="text-2xl font-bold text-blue-400">{{ stats.stones }}</div>
              <div class="text-sm text-blue-300">获得石头</div>
            </div>
            <div class="flex-1 rounded-xl bg-purple-600/20 p-4 text-center">
              <div class="text-2xl font-bold text-purple-400">{{ results.length }}</div>
              <div class="text-sm text-purple-300">总共</div>
            </div>
          </div>

          <!-- 结果网格 -->
          <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            <div
              v-for="result in sortedResults"
              :key="result.item.id"
              class="group relative overflow-hidden rounded-xl border-2 p-4 transition-all hover:scale-105"
              :class="[
                RARITY_CONFIG[result.item.rarity].borderColor,
                `bg-gradient-to-br ${RARITY_CONFIG[result.item.rarity].gradient}`.replace('from-', 'from-slate-800 ').replace('to-', 'to-slate-900 ')
              ]"
            >
              <!-- 稀有度光晕 -->
              <div
                class="absolute inset-0 opacity-20"
                :class="`bg-gradient-to-br ${RARITY_CONFIG[result.item.rarity].gradient}`"
              ></div>

              <!-- 内容 -->
              <div class="relative flex flex-col items-center">
                <!-- Emoji 图标 -->
                <div class="mb-2 text-4xl filter drop-shadow-lg">
                  {{ result.item.icon }}
                </div>

                <!-- 名称 -->
                <div
                  class="text-center text-sm font-bold"
                  :class="RARITY_CONFIG[result.item.rarity].textColor"
                >
                  {{ result.item.name }}
                </div>

                <!-- 稀有度标签 -->
                <div
                  class="mt-1 rounded px-2 py-0.5 text-xs font-medium text-white"
                  :class="`bg-gradient-to-r ${RARITY_CONFIG[result.item.rarity].gradient}`"
                >
                  {{ RARITY_CONFIG[result.item.rarity].name }}
                </div>

                <!-- 重复标识 -->
                <div
                  v-if="result.isDuplicate"
                  class="mt-1 flex items-center gap-1 text-xs text-yellow-400"
                >
                  <span>💎</span>
                  <span>+{{ result.stonesObtained }}</span>
                </div>

                <!-- 石头标识 -->
                <div
                  v-else-if="result.item.rarity === 'Common'"
                  class="mt-1 flex items-center gap-1 text-xs text-blue-400"
                >
                  <span>💎</span>
                  <span>+{{ result.stonesObtained }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 关闭按钮 -->
          <div class="mt-6 flex justify-center">
            <button
              @click="$emit('close')"
              class="rounded-xl bg-gradient-to-r from-yellow-600 to-yellow-500 px-8 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-yellow-500/50"
            >
              确定
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
