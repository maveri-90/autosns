<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <p class="text-gray-500 text-sm">ログイン処理中...</p>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const router = useRouter()

onMounted(async () => {
  // OAuth後のhashからセッションを確立するのを待つ
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    router.push('/dashboard')
    return
  }
  // セッションがまだない場合はonAuthStateChangeで待機
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      subscription.unsubscribe()
      router.push('/dashboard')
    } else if (event === 'SIGNED_OUT') {
      subscription.unsubscribe()
      router.push('/login')
    }
  })
  // 5秒タイムアウト
  setTimeout(() => {
    subscription.unsubscribe()
    router.push('/login')
  }, 5000)
})
</script>
