<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="bg-white p-8 rounded-xl shadow-md text-center w-full max-w-md">
      <div v-if="loading">
        <p class="text-gray-600">メール確認中...</p>
      </div>
      <div v-else-if="error">
        <p class="text-red-500 mb-4">{{ error }}</p>
        <NuxtLink to="/login" class="text-blue-600 hover:underline text-sm">ログインページへ</NuxtLink>
      </div>
      <div v-else>
        <p class="text-green-600 font-medium mb-2">メール確認が完了しました</p>
        <p class="text-gray-500 text-sm">ダッシュボードへ移動します...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const router = useRouter()
const route = useRoute()

const loading = ref(true)
const error = ref('')

onMounted(async () => {
  const token_hash = route.query.token_hash as string
  const type = route.query.type as string
  const code = route.query.code as string

  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (exchangeError) {
      error.value = '確認に失敗しました。リンクが無効か期限切れです。'
    } else {
      router.push('/dashboard')
    }
  } else if (token_hash && type) {
    const { error: verifyError } = await supabase.auth.verifyOtp({ token_hash, type: type as any })
    if (verifyError) {
      error.value = '確認に失敗しました。リンクが無効か期限切れです。'
    } else {
      router.push('/dashboard')
    }
  } else {
    error.value = '無効なリンクです。'
  }

  loading.value = false
})
</script>
