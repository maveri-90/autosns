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
  // Supabaseサーバーがエラーをクエリパラメータで返す場合
  const urlError = route.query.error as string
  if (urlError) {
    error.value = 'このリンクは期限切れか無効です。ログインページから確認メールを再送してください。'
    loading.value = false
    return
  }

  // implicitフロー: supabase-jsがURLハッシュ(#access_token=...)を自動検出
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session) {
      subscription.unsubscribe()
      router.push('/dashboard')
    }
  })

  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    subscription.unsubscribe()
    router.push('/dashboard')
    return
  }

  setTimeout(() => {
    subscription.unsubscribe()
    if (loading.value) {
      error.value = 'メール確認に失敗しました。リンクが期限切れの可能性があります。再送をお試しください。'
      loading.value = false
    }
  }, 5000)
})
</script>
