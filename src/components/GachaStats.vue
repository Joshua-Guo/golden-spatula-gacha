<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '../stores/user'
import { RARITY_CONFIG } from '../constants/pools'

const userStore = useUserStore()

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

// 评价颜色
const ratingColor = computed(() => userStore.gachaRating.color)
const ratingEmoji = computed(() => userStore.gachaRating.emoji)
const ratingTitle = computed(() => userStore.gachaRating.title)
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
          class="flex h-full w-full max-w-lg flex-col overflow-y-auto border-l-2 border-yellow-600/50 bg-gradient-to-b from-slate-900 to-slate-800 p-6"
          @click.stop
        >
          <!-- 标题 -->
          <div class="mb-6 flex items-center justify-between border-b border-yellow-600/30 pb-4">
            <h2 class="text-2xl font-bold text-yellow-400">
              📊 抽奖统计
            </h2>
            <button
              @click="$emit('close')"
              class="rounded-full bg-yellow-600/20 px-4 py-2 text-yellow-400 hover:bg-yellow-600/30 transition-colors"
            >
              ✕
            </button>
          </div>

          <!-- 评价卡片 -->
          <div class="mb-6 rounded-2xl border-2 border-yellow-600/30 bg-gradient-to-br from-yellow-600/10 to-yellow-600/5 p-6 text-center">
            <div class="mb-2 text-6xl">
              {{ ratingEmoji }}
            </div>
            <div
              class="text-3xl font-bold"
              :class="ratingColor"
            >
              {{ ratingTitle }}
            </div>
            <div class="mt-2 text-sm text-gray-400">
              欧气值：{{ Math.round((userStore.totalValue / (userStore.totalSpins * 600 || 1)) * 100) }}%
            </div>
          </div>

          <!-- 保底进度 -->
          <div class="mb-6 rounded-xl border-2 border-red-600/30 bg-gradient-to-r from-red-600/20 to-orange-600/20 p-4">
            <div class="mb-2 flex items-center justify-between">
              <span class="text-sm font-bold text-red-400">🎯 保底进度</span>
              <span class="text-sm font-bold text-red-400">{{ userStore.pityCounter }} / 100</span>
            </div>
            <div class="overflow-hidden rounded-full bg-gray-700">
              <div
                class="h-4 bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500"
                :style="{ width: `${userStore.pityCounter}%` }"
              ></div>
            </div>
            <div class="mt-2 text-xs text-red-300">
              {{ 100 - userStore.pityCounter }} 抽内必出神话
            </div>
          </div>

          <!-- 神话统计 -->
          <div class="mb-6 grid grid-cols-2 gap-3">
            <div class="rounded-xl bg-red-600/20 p-4 text-center">
              <div class="text-2xl font-bold text-red-400">
                🐉 {{ userStore.gachaHistory.filter(r => r.item.rarity === 'Mythic' && !r.isDuplicate).length }}
              </div>
              <div class="text-xs text-red-300">神话 (新)</div>
            </div>
            <div class="rounded-xl bg-orange-600/20 p-4 text-center">
              <div class="text-2xl font-bold text-orange-400">
                💎 {{ userStore.gachaHistory.filter(r => r.item.rarity === 'Mythic' && r.isDuplicate).length }}
              </div>
              <div class="text-xs text-orange-300">神话 (重复)</div>
            </div>
          </div>

          <!-- 核心数据 -->
          <div class="mb-6 grid grid-cols-3 gap-3">
            <!-- 总抽奖数 -->
            <div class="rounded-xl bg-blue-600/20 p-4 text-center">
              <div class="text-2xl font-bold text-blue-400">
                {{ userStore.totalSpins }}
              </div>
              <div class="text-xs text-blue-300">总抽奖</div>
            </div>

            <!-- 总价值 -->
            <div class="rounded-xl bg-purple-600/20 p-4 text-center">
              <div class="text-2xl font-bold text-purple-400">
                {{ userStore.totalValue }}
              </div>
              <div class="text-xs text-purple-300">总价值</div>
            </div>

            <!-- 平均价值 -->
            <div class="rounded-xl bg-green-600/20 p-4 text-center">
              <div class="text-2xl font-bold text-green-400">
                {{ userStore.averageValue }}
              </div>
              <div class="text-xs text-green-300">平均值</div>
            </div>
          </div>

          <!-- Top 5 最值钱物品 -->
          <div class="mb-6">
            <h3 class="mb-3 text-lg font-bold text-yellow-400">
              🏆 最值钱物品 Top 5
            </h3>

            <div v-if="userStore.top5Items.length === 0" class="text-center text-gray-500 py-8">
              <div class="text-4xl mb-2">🎲</div>
              <p>还没有抽奖记录</p>
            </div>

            <div v-else class="space-y-2">
              <div
                v-for="(item, index) in userStore.top5Items"
                :key="item.id + index"
                class="flex items-center gap-3 rounded-xl border border-gray-700 bg-slate-800/50 p-3 transition-all hover:border-yellow-600/50"
              >
                <!-- 排名 -->
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full font-bold text-white"
                  :class="{
                    'bg-gradient-to-br from-yellow-500 to-yellow-600': index === 0,
                    'bg-gradient-to-br from-gray-400 to-gray-500': index === 1,
                    'bg-gradient-to-br from-orange-600 to-orange-700': index === 2,
                    'bg-gradient-to-br from-blue-600 to-blue-700': index >= 3
                  }"
                >
                  {{ index + 1 }}
                </div>

                <!-- 物品图标 -->
                <div class="text-3xl">
                  {{ item.icon }}
                </div>

                <!-- 物品信息 -->
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-white">{{ item.name }}</span>
                    <span
                      v-if="item.isDuplicate"
                      class="rounded bg-red-600/20 px-2 py-0.5 text-xs text-red-400"
                    >
                      重复
                    </span>
                  </div>
                  <div class="text-xs" :class="RARITY_CONFIG[item.rarity].textColor">
                    {{ RARITY_CONFIG[item.rarity].name }}
                  </div>
                </div>

                <!-- 价值 -->
                <div class="text-right">
                  <div class="text-lg font-bold text-blue-400">
                    💎 {{ item.value }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 稀有度分布 -->
          <div v-if="userStore.gachaHistory.length > 0">
            <h3 class="mb-3 text-lg font-bold text-yellow-400">
              📈 稀有度分布
            </h3>

            <div class="space-y-2">
              <div
                v-for="(config, rarity) in RARITY_CONFIG"
                :key="rarity"
                v-show="rarity !== 'Common'"
                class="flex items-center gap-3"
              >
                <!-- 稀有度名称 -->
                <div class="w-20 text-sm text-gray-400">
                  {{ config.name }}
                </div>

                <!-- 进度条背景 -->
                <div class="flex-1 overflow-hidden rounded-full bg-gray-700">
                  <!-- 进度条 -->
                  <div
                    class="h-4 rounded-full transition-all duration-500"
                    :class="`bg-gradient-to-r ${config.gradient}`"
                    :style="{
                      width: `${(userStore.gachaHistory.filter(r => r.item.rarity === rarity).length / userStore.gachaHistory.length * 100) || 0}%`
                    }"
                  ></div>
                </div>

                <!-- 数量 -->
                <div class="w-12 text-right text-sm font-bold text-white">
                  {{ userStore.gachaHistory.filter(r => r.item.rarity === rarity).length }}
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
