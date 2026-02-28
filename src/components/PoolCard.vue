<script setup lang="ts">
import type { Pool } from '../types'

defineProps<{
  pool: Pool
}>()

defineEmits<{
  select: [poolId: string]
}>()
</script>

<template>
  <div
    @click="$emit('select', pool.id)"
    class="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-yellow-600/50 bg-gradient-to-br transition-all duration-300 hover:scale-105 hover:border-yellow-400 hover:shadow-2xl hover:shadow-yellow-500/30"
    :class="pool.gradient"
  >
    <!-- 光晕效果 -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40"></div>
    
    <!-- 闪光动画 -->
    <div class="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-20">
      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shine"></div>
    </div>

    <!-- 内容 -->
    <div class="relative flex h-full flex-col items-center justify-center p-8 text-center">
      <!-- Emoji 图标 -->
      <div class="mb-4 text-7xl drop-shadow-lg filter group-hover:scale-110 transition-transform duration-300">
        {{ pool.icon }}
      </div>

      <!-- 名称 -->
      <h3 class="mb-2 text-3xl font-bold text-white drop-shadow-md">
        {{ pool.name }}
      </h3>
      <p class="mb-4 text-sm font-medium text-white/80 uppercase tracking-wider">
        {{ pool.nameEn }}
      </p>

      <!-- 描述 -->
      <p class="text-sm text-white/70 line-clamp-2">
        {{ pool.description }}
      </p>

      <!-- 物品数量 -->
      <div class="mt-6 flex items-center gap-2 rounded-full bg-black/30 px-4 py-2 text-xs text-white/90">
        <span>🎁</span>
        <span>{{ pool.items.length }} 个物品</span>
      </div>

      <!-- 稀有度分布 -->
      <div class="mt-4 flex gap-1">
        <div v-for="rarity in ['Mythic', 'Legendary', 'Epic', 'Rare']" :key="rarity" 
             class="h-2 w-8 rounded-full"
             :class="{
               'bg-gradient-to-r from-red-500 to-red-600': rarity === 'Mythic',
               'bg-gradient-to-r from-yellow-400 to-yellow-500': rarity === 'Legendary',
               'bg-gradient-to-r from-purple-500 to-purple-600': rarity === 'Epic',
               'bg-gradient-to-r from-blue-500 to-blue-600': rarity === 'Rare'
             }">
        </div>
      </div>
    </div>

    <!-- 悬停提示 -->
    <div class="absolute bottom-0 left-0 right-0 translate-y-full bg-yellow-500 py-2 text-center text-sm font-bold text-black transition-transform duration-300 group-hover:translate-y-0">
      点击进入 →
    </div>
  </div>
</template>
