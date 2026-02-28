<script setup lang="ts">
import { ref, watch } from 'vue'
import { useUserStore } from '../stores/user'
import type { GachaResult } from '../types'
import { RARITY_CONFIG } from '../constants/pools'
import confetti from 'canvas-confetti'

const userStore = useUserStore()

const props = defineProps<{
  poolId: string
  autoSpinTen?: boolean
}>()

const emit = defineEmits<{
  back: []
  showResult: [results: GachaResult[]]
  'update:autoSpinTen': [value: boolean]
}>()

const isSpinning = ref(false)

// 监听自动十连信号
watch(() => props.autoSpinTen, async (newVal) => {
  if (newVal && !isSpinning.value && userStore.hasSpinsRemaining) {
    // 重置标志
    emit('update:autoSpinTen', false)
    // 延迟一点再抽
    await new Promise(resolve => setTimeout(resolve, 500))
    // 执行十连
    await spinTen(true)
  }
})

// 触发 confetti 特效
function triggerConfetti(intensity: 'normal' | 'epic') {
  const duration = intensity === 'epic' ? 3000 : 1500
  const particleCount = intensity === 'epic' ? 150 : 80

  // 左侧彩带
  confetti({
    particleCount,
    startVelocity: intensity === 'epic' ? 50 : 30,
    spread: 180,
    origin: { x: 0.1, y: 0.6 },
    colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'],
    ticks: duration / 10
  })

  // 右侧彩带
  setTimeout(() => {
    confetti({
      particleCount,
      startVelocity: intensity === 'epic' ? 50 : 30,
      spread: 180,
      origin: { x: 0.9, y: 0.6 },
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'],
      ticks: duration / 10
    })
  }, 250)

  // 中间爆炸效果（仅史诗）
  if (intensity === 'epic') {
    setTimeout(() => {
      confetti({
        particleCount: 200,
        startVelocity: 60,
        spread: 360,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#ffd700', '#ff6b6b', '#4ecdc4'],
        ticks: 40
      })
    }, 500)
  }
}

// 单抽
async function spinOnce() {
  if (isSpinning.value || !userStore.hasSpinsRemaining) return

  isSpinning.value = true

  // 模拟动画时间
  await new Promise(resolve => setTimeout(resolve, 800))

  try {
    const result = userStore.pullOnce()

    // 检查是否需要特效
    if (result.item.rarity === 'Mythic') {
      triggerConfetti('epic')
    } else if (result.item.rarity === 'Legendary' || result.item.rarity === 'Special') {
      triggerConfetti('normal')
    }

    // 显示结果
    emit('showResult', [result])
  } catch (error) {
    console.error(error)
  } finally {
    isSpinning.value = false
  }
}

// 十连抽
async function spinTen(isAuto = false) {
  if (isSpinning.value || !userStore.hasSpinsRemaining) return

  isSpinning.value = true

  // 模拟动画时间
  await new Promise(resolve => setTimeout(resolve, 1500))

  try {
    const results = userStore.pullTenTimes()
    
    // 检查是否有大奖
    const hasMythic = results.some(r => r.item.rarity === 'Mythic')
    const hasLegendary = results.some(r => r.item.rarity === 'Legendary' || r.item.rarity === 'Special')
    
    if (hasMythic) {
      triggerConfetti('epic')
    } else if (hasLegendary) {
      triggerConfetti('normal')
    }

    // 显示结果
    emit('showResult', results)
  } catch (error) {
    console.error(error)
  } finally {
    isSpinning.value = false
  }
}
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- 返回按钮 -->
    <button
      @click="$emit('back')"
      class="mb-4 flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors"
    >
      <span>←</span>
      <span>返回卡池列表</span>
    </button>

    <!-- 抽奖区域 -->
    <div class="flex-1 rounded-2xl border-2 border-yellow-600/50 bg-gradient-to-br from-slate-800 to-slate-900 p-8">
      <!-- 抽奖动画区域 -->
      <div class="mb-8 flex h-64 items-center justify-center">
        <div v-if="isSpinning" class="relative">
          <!-- 旋转的圆圈 -->
          <div class="h-32 w-32 animate-spin rounded-full border-4 border-yellow-500/30 border-t-yellow-400"></div>
          <!-- 中心图标 -->
          <div class="absolute inset-0 flex items-center justify-center text-5xl">
            🎰
          </div>
        </div>
        <div v-else class="text-center">
          <div class="mb-4 text-8xl">🎁</div>
          <p class="text-xl font-bold text-yellow-400">准备抽奖</p>
          <p class="text-sm text-gray-400 mt-2">剩余 {{ userStore.spinsRemaining }} 次</p>
        </div>
      </div>

      <!-- 抽奖按钮 -->
      <div class="flex justify-center gap-4">
        <!-- 单抽按钮 -->
        <button
          @click="spinOnce"
          :disabled="isSpinning || !userStore.hasSpinsRemaining"
          class="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          <span class="relative z-10 flex items-center gap-2">
            <span>✨</span>
            <span>单抽</span>
          </span>
          <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-400 opacity-0 transition-opacity group-hover:opacity-100"></div>
        </button>

        <!-- 十连按钮 -->
        <button
          @click="spinTen"
          :disabled="isSpinning || !userStore.hasSpinsRemaining"
          class="group relative overflow-hidden rounded-xl bg-gradient-to-r from-yellow-600 to-yellow-500 px-8 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-yellow-500/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          <span class="relative z-10 flex items-center gap-2">
            <span>🎉</span>
            <span>十连</span>
          </span>
          <div class="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-400 opacity-0 transition-opacity group-hover:opacity-100"></div>
        </button>
      </div>

      <!-- 提示信息 -->
      <div v-if="!userStore.hasSpinsRemaining" class="mt-6 text-center">
        <div class="rounded-2xl border-2 border-pink-600/30 bg-gradient-to-r from-pink-600/10 to-purple-600/10 p-6">
          <p class="text-pink-400 font-bold text-lg mb-2">⚠️ 抽奖次数已用完</p>
          <p class="text-gray-300 mb-4">
            想要继续抽奖？在顶部点击 <span class="text-pink-400 font-bold">"兑换码"</span> 按钮
          </p>
          <div class="text-xl font-bold text-yellow-400 bg-slate-800/50 rounded-lg py-2 px-4 inline-block mb-3">
            输入：主任真帅
          </div>
          <p class="text-sm text-green-400">
            ✅ 可获得 <span class="font-bold">+100 抽</span>（可重复领取）
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
