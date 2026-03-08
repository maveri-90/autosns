<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <h1 class="text-xl font-bold text-blue-600">SNS Post Calendar</h1>
      <NuxtLink to="/dashboard" class="text-sm text-gray-500 hover:underline">← ダッシュボードへ戻る</NuxtLink>
    </header>

    <main class="max-w-5xl mx-auto px-6 py-16">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold mb-4">料金プラン</h2>
        <p class="text-gray-500">シンプルな料金体系で、必要な機能だけ使えます</p>
        <p v-if="currentPlan" class="mt-3 text-sm text-blue-600 font-medium">
          現在のプラン：{{ planLabel(currentPlan) }}
        </p>
      </div>

      <div v-if="successMsg" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 text-center text-green-800">
        {{ successMsg }}
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        <!-- フリープラン -->
        <div class="bg-white rounded-xl shadow-sm p-8 border relative" :class="currentPlan === 'free' ? 'border-2 border-green-400' : 'border-gray-200'">
          <span v-if="currentPlan === 'free'" class="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-400 text-white text-xs px-3 py-1 rounded-full">現在のプラン</span>
          <h3 class="text-xl font-bold mb-2">フリー</h3>
          <div class="text-4xl font-bold mb-1">¥0</div>
          <p class="text-gray-500 text-sm mb-6">ずっと無料</p>
          <ul class="space-y-3 mb-8 text-sm text-gray-600">
            <li class="flex items-center gap-2"><span class="text-green-500">✓</span> AIネタ生成（月3回まで）</li>
            <li class="flex items-center gap-2"><span class="text-green-500">✓</span> 投稿文生成（月10回まで）</li>
            <li class="flex items-center gap-2"><span class="text-green-500">✓</span> 投稿カレンダー</li>
          </ul>
          <div class="w-full border border-gray-300 text-gray-500 py-3 rounded-lg text-sm font-medium text-center">
            {{ currentPlan === 'free' ? '利用中' : '無料プラン' }}
          </div>
        </div>

        <!-- スタータープラン -->
        <div class="bg-white rounded-xl shadow-sm p-8 border relative" :class="currentPlan === 'starter' ? 'border-2 border-green-400' : 'border-gray-200'">
          <span v-if="currentPlan === 'starter'" class="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-400 text-white text-xs px-3 py-1 rounded-full">現在のプラン</span>
          <h3 class="text-xl font-bold mb-2">スターター</h3>
          <div class="text-4xl font-bold mb-1">¥490</div>
          <p class="text-gray-500 text-sm mb-6">/ 月（税込）</p>
          <ul class="space-y-3 mb-8 text-sm text-gray-600">
            <li class="flex items-center gap-2"><span class="text-green-500">✓</span> AIネタ生成（月30回まで）</li>
            <li class="flex items-center gap-2"><span class="text-green-500">✓</span> 投稿文生成（月50回まで）</li>
            <li class="flex items-center gap-2"><span class="text-green-500">✓</span> 投稿カレンダー</li>
            <li class="flex items-center gap-2"><span class="text-green-500">✓</span> 複数SNS対応</li>
          </ul>
          <button v-if="currentPlan === 'starter'" @click="openPortal" :disabled="portalLoading"
            class="w-full border border-gray-300 text-gray-600 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50">
            {{ portalLoading ? '処理中...' : 'プランを管理する' }}
          </button>
          <button v-else @click="subscribeStarter" :disabled="starterLoading || currentPlan === 'pro'"
            class="w-full bg-gray-800 text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-900 disabled:opacity-50">
            {{ starterLoading ? '処理中...' : 'スタータープランを始める' }}
          </button>
        </div>

        <!-- プロプラン -->
        <div class="bg-white rounded-xl shadow-sm p-8 border-2 relative" :class="currentPlan === 'pro' ? 'border-green-400' : 'border-blue-500'">
          <span class="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-xs px-3 py-1 rounded-full"
            :class="currentPlan === 'pro' ? 'bg-green-400' : 'bg-blue-500'">
            {{ currentPlan === 'pro' ? '現在のプラン' : 'おすすめ' }}
          </span>
          <h3 class="text-xl font-bold mb-2">プロ</h3>
          <div class="text-4xl font-bold mb-1">¥1,980</div>
          <p class="text-gray-500 text-sm mb-6">/ 月（税込）</p>
          <ul class="space-y-3 mb-8 text-sm text-gray-600">
            <li class="flex items-center gap-2"><span class="text-green-500">✓</span> AIネタ生成（無制限）</li>
            <li class="flex items-center gap-2"><span class="text-green-500">✓</span> 投稿文生成（無制限）</li>
            <li class="flex items-center gap-2"><span class="text-green-500">✓</span> 投稿カレンダー</li>
            <li class="flex items-center gap-2"><span class="text-green-500">✓</span> 複数SNS対応</li>
            <li class="flex items-center gap-2"><span class="text-green-500">✓</span> 優先サポート</li>
          </ul>
          <button v-if="currentPlan === 'pro'" @click="openPortal" :disabled="portalLoading"
            class="w-full border border-gray-300 text-gray-600 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50">
            {{ portalLoading ? '処理中...' : 'プランを管理する' }}
          </button>
          <button v-else @click="subscribePro" :disabled="proLoading"
            class="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            {{ proLoading ? '処理中...' : 'プロプランを始める' }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({
  title: '料金プラン｜SNS Post Calendar',
  meta: [
    { name: 'description', content: 'SNS Post Calendarの料金プラン。フリー・スターター（¥490）・プロ（¥1,980）の3プランをご用意。AIネタ生成・投稿文自動作成・カレンダー管理。' }
  ]
})

const supabase = useSupabaseClient()
const route = useRoute()
const starterLoading = ref(false)
const proLoading = ref(false)
const portalLoading = ref(false)
const successMsg = ref('')
const currentPlan = ref<string | null>(null)

const STARTER_PRICE_ID = 'price_1T8dtbFeFZeDdhZunTOrY9tl'
const PRO_PRICE_ID = 'price_1T8BxSFeFZeDdhZutnLcGDoL'

const planLabel = (plan: string) => ({ free: 'フリー', starter: 'スターター', pro: 'プロ' }[plan] ?? plan)

onMounted(async () => {
  if (route.query.success === '1') {
    successMsg.value = 'プランへのアップグレードが完了しました！'
  }
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return
  const { data } = await supabase.from('profiles').select('plan').eq('id', session.user.id).single()
  currentPlan.value = data?.plan ?? 'free'
})

const checkout = async (priceId: string) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return
  const res = await $fetch('/api/stripe/checkout', {
    method: 'POST',
    body: { priceId, userId: session.user.id, email: session.user.email }
  })
  window.location.href = (res as any).url
}

const openPortal = async () => {
  portalLoading.value = true
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const res = await $fetch('/api/stripe/portal', {
      method: 'POST',
      body: { userId: session.user.id }
    })
    window.location.href = (res as any).url
  } catch (e: any) {
    alert(`エラー: ${e.data?.message || e.message}`)
    portalLoading.value = false
  }
}

const subscribeStarter = async () => {
  starterLoading.value = true
  try { await checkout(STARTER_PRICE_ID) }
  catch (e: any) { alert(`エラー: ${e.message}`); starterLoading.value = false }
}

const subscribePro = async () => {
  proLoading.value = true
  try { await checkout(PRO_PRICE_ID) }
  catch (e: any) { alert(`エラー: ${e.message}`); proLoading.value = false }
}
</script>
