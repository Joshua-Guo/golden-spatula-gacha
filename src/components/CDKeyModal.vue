<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const codeInput = ref('')
const redeemMessage = ref<{ success: boolean; text: string } | null>(null)

function handleRedeem() {
  if (!codeInput.value.trim()) {
    redeemMessage.value = { success: false, text: '请输入兑换码' }
    return
  }

  const result = userStore.redeemCode(codeInput.value)
  
  if (result.success) {
    redeemMessage.value = { success: true, text: result.message }
    codeInput.value = ''
    
    // 成功后 2 秒自动关闭
    setTimeout(() => {
      emit('close')
      redeemMessage.value = null
    }, 2000)
  } else {
    redeemMessage.value = { success: false, text: result.message }
  }
}

function handleClose() {
  emit('close')
  redeemMessage.value = null
  codeInput.value = ''
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        @click="handleClose"
      >
        <!-- 弹窗内容 -->
        <div
          class="mx-4 w-full max-w-md rounded-3xl border-2 border-yellow-600/50 bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-2xl"
          @click.stop
        >
          <!-- 标题 -->
          <div class="mb-6 text-center">
            <h2 class="text-2xl font-bold text-yellow-400">
              🎁 兑换码
            </h2>
            <p class="text-sm text-gray-400 mt-1">
              输入兑换码获取奖励
            </p>
          </div>

          <!-- 输入框 -->
          <div class="mb-4">
            <input
              v-model="codeInput"
              type="text"
              placeholder="请输入兑换码"
              class="w-full rounded-xl border-2 border-yellow-600/30 bg-slate-800 px-4 py-3 text-center text-lg text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
              @keyup.enter="handleRedeem"
            />
          </div>

          <!-- 提示信息 -->
          <div
            v-if="redeemMessage"
            class="mb-4 rounded-xl p-4 text-center"
            :class="redeemMessage.success ? 'bg-green-600/20' : 'bg-red-600/20'"
          >
            <p
              class="font-bold"
              :class="redeemMessage.success ? 'text-green-400' : 'text-red-400'"
            >
              {{ redeemMessage.text }}
            </p>
          </div>

          <!-- 按钮 -->
          <div class="flex gap-3">
            <button
              @click="handleClose"
              class="flex-1 rounded-xl border-2 border-gray-600 py-3 font-bold text-gray-400 hover:bg-gray-600/20 transition-all"
            >
              取消
            </button>
            <button
              @click="handleRedeem"
              class="flex-1 rounded-xl bg-gradient-to-r from-yellow-600 to-yellow-500 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-yellow-500/50"
            >
              兑换
            </button>
          </div>

          <!-- 提示 -->
          <div class="mt-4 text-center text-xs text-gray-500">
            <p>💡 提示：关注官方渠道获取最新兑换码</p>
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
