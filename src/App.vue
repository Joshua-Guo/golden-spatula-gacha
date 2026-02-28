<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from './stores/user'
import { POOLS } from './constants/pools'
import PoolCard from './components/PoolCard.vue'
import GachaMachine from './components/GachaMachine.vue'
import ResultModal from './components/ResultModal.vue'
import ShopModal from './components/ShopModal.vue'
import CDKeyModal from './components/CDKeyModal.vue'
import GachaStats from './components/GachaStats.vue'
import type { GachaResult } from './types'

const userStore = useUserStore()

// 状态
const selectedPoolId = ref<string | null>(null)
const showResultModal = ref(false)
const showShopModal = ref(false)
const showCDKeyModal = ref(false)
const showStatsModal = ref(false)
const currentResults = ref<GachaResult[]>([])

// 当前选中的卡池
const currentPool = computed(() => {
  if (!selectedPoolId.value) return null
  return POOLS.find(p => p.id === selectedPoolId.value) || null
})

// 显示抽奖结果
function showResult(results: GachaResult[]) {
  currentResults.value = results
  showResultModal.value = true
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
    <!-- 顶部导航栏 -->
    <header class="sticky top-0 z-40 border-b border-yellow-600/30 bg-slate-900/95 backdrop-blur-sm">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <!-- 标题 -->
        <div class="flex items-center gap-3">
          <span class="text-3xl">🏆</span>
          <div>
            <h1 class="text-xl font-bold text-yellow-400">金铲铲之战</h1>
            <p class="text-xs text-gray-400">抽奖模拟器</p>
          </div>
        </div>

        <!-- 状态信息 -->
        <div class="flex items-center gap-3">
          <!-- 统计按钮 -->
          <button
            @click="showStatsModal = true"
            class="flex items-center gap-2 rounded-full bg-gradient-to-r from-green-600 to-green-500 px-4 py-2 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-green-500/50"
            title="查看统计"
          >
            <span>📊</span>
            <span class="hidden sm:inline">统计</span>
          </button>

          <!-- 兑换码按钮 -->
          <button
            @click="showCDKeyModal = true"
            class="flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-600 to-pink-500 px-4 py-2 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-pink-500/50"
            title="兑换码"
          >
            <span>🎁</span>
            <span class="hidden sm:inline">兑换码</span>
          </button>

          <!-- 剩余抽数 -->
          <div class="flex items-center gap-2 rounded-full bg-yellow-600/20 px-4 py-2">
            <span class="text-xl">🎰</span>
            <div>
              <div class="text-xs text-gray-400">剩余抽数</div>
              <div class="text-lg font-bold text-yellow-400">
                {{ userStore.spinsRemaining }}
              </div>
            </div>
          </div>

          <!-- 石头数量 -->
          <div class="flex items-center gap-2 rounded-full bg-blue-600/20 px-4 py-2">
            <span class="text-xl">💎</span>
            <div>
              <div class="text-xs text-gray-400">棱彩石</div>
              <div class="text-lg font-bold text-blue-400">
                {{ userStore.prismaticStones }}
              </div>
            </div>
          </div>

          <!-- 背包按钮 -->
          <button
            @click="showShopModal = true"
            class="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 px-4 py-2 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-purple-500/50"
          >
            <span>🎒</span>
            <span class="hidden sm:inline">背包</span>
          </button>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="mx-auto max-w-7xl px-4 py-8">
      <!-- 卡池列表视图 -->
      <div v-if="!selectedPoolId" class="space-y-8">
        <!-- 欢迎信息 -->
        <div class="text-center">
          <h2 class="mb-2 text-3xl font-bold text-white">选择卡池</h2>
          <p class="text-gray-400">每个卡池都有独特的传说物品，小心不要重复哦！</p>
        </div>

        <!-- 卡池网格 -->
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <PoolCard
            v-for="pool in POOLS"
            :key="pool.id"
            :pool="pool"
            @select="selectedPoolId = pool.id"
          />
        </div>

        <!-- 提示信息 -->
        <div class="rounded-2xl border border-yellow-600/30 bg-yellow-600/10 p-6">
          <h3 class="mb-3 text-lg font-bold text-yellow-400">📋 游戏规则</h3>
          <ul class="space-y-2 text-sm text-gray-300">
            <li>• 每个用户最多只能抽 <span class="font-bold text-yellow-400">60 次</span></li>
            <li>• 抽到重复物品会自动转化为 <span class="font-bold text-blue-400">棱彩兑换石</span></li>
            <li>• 石头可以在背包中兑换未拥有的物品</li>
            <li>• 稀有度越高，转化的石头越多</li>
          </ul>
        </div>
      </div>

      <!-- 抽奖视图 -->
      <div v-else>
        <GachaMachine
          :pool-id="selectedPoolId"
          @back="selectedPoolId = null"
          @show-result="showResult"
        />
      </div>
    </main>

    <!-- 底部信息 -->
    <footer class="border-t border-yellow-600/20 bg-slate-900/50 py-6">
      <div class="mx-auto max-w-7xl px-4 text-center text-sm text-gray-500">
        <p>🎮 金铲铲之战抽奖模拟器 - 仅供娱乐</p>
        <p class="mt-1 text-xs">本模拟器与官方游戏无关，所有数据均为虚构</p>
      </div>
    </footer>

    <!-- 结果弹窗 -->
    <ResultModal
      :results="currentResults"
      :show="showResultModal"
      @close="showResultModal = false"
    />

    <!-- 商店弹窗 -->
    <ShopModal
      :show="showShopModal"
      @close="showShopModal = false"
    />

    <!-- 兑换码弹窗 -->
    <CDKeyModal
      :show="showCDKeyModal"
      @close="showCDKeyModal = false"
    />

    <!-- 统计弹窗 -->
    <GachaStats
      :show="showStatsModal"
      @close="showStatsModal = false"
    />
  </div>
</template>
