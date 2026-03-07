<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <h1 class="text-xl font-bold text-blue-600">SNS Post Calendar</h1>
      <NuxtLink to="/dashboard" class="text-sm text-gray-500 hover:underline">ダッシュボードへ</NuxtLink>
    </header>

    <main class="max-w-4xl mx-auto px-6 py-16">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold mb-4">料金プラン</h2>
        <p class="text-gray-500">シンプルな料金体系で、必要な機能だけ使えます</p>
      </div>

      <div v-if="successMsg" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 text-center text-green-800">
        {{ successMsg }}
      </div>

      <div class="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        <!-- フリープラン -->
        <div class="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
          <h3 class="text-xl font-bold mb-2">フリー</h3>
          <div class="text-4xl font-bold mb-1">¥0</div>
          <p class="text-gray-500 text-sm mb-6">ずっと無料</p>
          <ul class="space-y-3 mb-8 text-sm text-gray-600">
            <li class="flex items-center gap-2">
              <span class="text-green-500">✓</span> AIネタ生成（月5回まで）
            </li>
            <li class="flex items-center gap-2">
              <span class="text-green-500">✓</span> 投稿カレンダー
            </li>
            <li class="flex items-center gap-2">
              <span class="text-green-500">✓</span> 投稿保存（10件まで）
            </li>
          </ul>
          <div class="w-full border border-gray-300 text-gray-600 py-3 rounded-lg text-sm font-medium text-center">
            現在のプラン
          </div>
        </div>

        <!-- プロプラン -->
        <div class="bg-white rounded-xl shadow-sm p-8 border-2 border-blue-500 relative">
          <span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">おすすめ</span>
          <h3 class="text-xl font-bold mb-2">プロ</h3>
          <div class="text-4xl font-bold mb-1">¥1,980</div>
          <p class="text-gray-500 text-sm mb-6">/ 月（税込）</p>
          <ul class="space-y-3 mb-8 text-sm text-gray-600">
            <li class="flex items-center gap-2">
              <span class="text-green-500">✓</span> AIネタ生成（無制限）
            </li>
            <li class="flex items-center gap-2">
              <span class="text-green-500">✓</span> 投稿カレンダー
            </li>
            <li class="flex items-center gap-2">
              <span class="text-green-500">✓</span> 投稿保存（無制限）
            </li>
            <li class="flex items-center gap-2">
              <span class="text-green-500">✓</span> 複数SNS対応
            </li>
            <li class="flex items-center gap-2">
              <span class="text-green-500">✓</span> 優先サポート
            </li>
          </ul>
          <button
            @click="subscribe"
            :disabled="loading"
            class="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {{ loading ? '処理中...' : 'プロプランを始める' }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const supabase = useSupabaseClient()
const route = useRoute()
const loading = ref(false)
const successMsg = ref('')

// Stripeの価格ID（Stripeダッシュボードで作成後に差し替え）
const PRO_PRICE_ID = 'price_1T8BxSFeFZeDdhZutnLcGDoL'

onMounted(() => {
  if (route.query.success === '1') {
    successMsg.value = 'プロプランへのアップグレードが完了しました！'
  }
})

const subscribe = async () => {
  loading.value = true
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const res = await $fetch('/api/stripe/checkout', {
      method: 'POST',
      body: {
        priceId: PRO_PRICE_ID,
        userId: session.user.id,
        email: session.user.email
      }
    })

    window.location.href = (res as any).url
  } catch (e: any) {
    alert(`エラー: ${e.message}`)
    loading.value = false
  }
}
</script>
