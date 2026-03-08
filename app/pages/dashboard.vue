<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm px-6 py-4">
      <div class="flex justify-between items-center">
        <NuxtLink to="/dashboard" class="text-xl font-bold text-blue-600">SNS Post Calendar</NuxtLink>
        <!-- デスクトップナビ -->
        <div class="hidden md:flex items-center gap-4">
          <NuxtLink to="/calendar" class="text-sm text-blue-600 hover:underline">カレンダーを見る</NuxtLink>
          <NuxtLink to="/pricing" class="text-sm text-gray-500 hover:underline">料金プラン</NuxtLink>
          <NuxtLink to="/onboarding" class="text-sm text-gray-500 hover:underline">業種・SNS設定</NuxtLink>
          <button v-if="profile?.plan && profile.plan !== 'free'" @click="openPortal" :disabled="portalLoading" class="text-sm text-gray-500 hover:underline disabled:opacity-50">
            {{ portalLoading ? '処理中...' : 'プラン管理' }}
          </button>
          <span class="text-sm text-gray-400">{{ user?.email }}</span>
          <button @click="logout" class="text-sm text-gray-500 hover:text-gray-700">ログアウト</button>
        </div>
        <!-- モバイルハンバーガー -->
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden p-2 text-gray-500">
          <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <!-- モバイルメニュー -->
      <div v-if="mobileMenuOpen" class="md:hidden border-t mt-4 pt-4 flex flex-col gap-3">
        <NuxtLink to="/calendar" class="text-sm text-blue-600" @click="mobileMenuOpen = false">カレンダーを見る</NuxtLink>
        <NuxtLink to="/pricing" class="text-sm text-gray-500" @click="mobileMenuOpen = false">料金プラン</NuxtLink>
        <NuxtLink to="/onboarding" class="text-sm text-gray-500" @click="mobileMenuOpen = false">業種・SNS設定</NuxtLink>
        <button v-if="profile?.plan && profile.plan !== 'free'" @click="openPortal" :disabled="portalLoading" class="text-sm text-gray-500 text-left disabled:opacity-50">
          {{ portalLoading ? '処理中...' : 'プラン管理' }}
        </button>
        <span class="text-sm text-gray-400">{{ user?.email }}</span>
        <button @click="logout" class="text-sm text-red-500 text-left">ログアウト</button>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-6 py-8">
      <!-- プロフィール未設定の場合 -->
      <div v-if="!profile" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-center justify-between">
        <p class="text-yellow-800 text-sm">業種を設定するとAIがネタを提案します</p>
        <NuxtLink to="/onboarding" class="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-600">設定する</NuxtLink>
      </div>

      <!-- AIネタ生成 -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold">AIネタ提案</h2>
          <NuxtLink v-if="profile" to="/onboarding" class="text-xs text-gray-400 hover:text-blue-500 hover:underline">
            {{ profile.business_type || '業種未設定' }}
            <span v-if="profile.target_audience"> ／ {{ profile.target_audience }}</span>
            　✎
          </NuxtLink>
        </div>
        <div class="flex gap-4 items-end">
          <div>
            <label class="block text-sm text-gray-600 mb-1">対象月</label>
            <input v-model="targetMonth" type="month" class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div class="flex flex-col gap-1">
            <button
              @click="generateIdeas"
              :disabled="generating || !profile"
              class="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {{ generating ? 'AI生成中...' : 'ネタを生成する' }}
            </button>
            <span v-if="ideasRemaining !== null" class="text-xs text-gray-400 text-center">
              今月残り{{ ideasRemaining }}回（{{ profile?.plan === 'starter' ? 'スタータープラン' : 'フリープラン' }}）
            </span>
          </div>
        </div>
      </div>

      <!-- 生成されたネタ一覧 -->
      <div v-if="ideas.length > 0" class="bg-white rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-bold mb-4">生成されたネタ（{{ ideas.length }}件）</h2>
        <div class="grid gap-3">
          <div
            v-for="(idea, index) in ideas" :key="index"
            class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition cursor-pointer"
            @click="selectIdea(idea)"
          >
            <div class="flex items-start justify-between">
              <div>
                <span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full mr-2">{{ idea.category }}</span>
                <span class="font-medium">{{ idea.title }}</span>
                <p class="text-sm text-gray-500 mt-1">{{ idea.description }}</p>
              </div>
              <button class="text-xs text-blue-600 hover:underline ml-4 shrink-0">投稿文を生成</button>
            </div>
          </div>
        </div>
      </div>


<!-- トースト通知 -->
      <Transition name="toast">
        <div v-if="toast.show"
          class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white"
          :class="toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'"
        >
          {{ toast.message }}
        </div>
      </Transition>

      <!-- 投稿文生成モーダル -->
      <div v-if="selectedIdea" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4">
          <h3 class="font-bold text-lg mb-2">{{ selectedIdea.title }}</h3>
          <div class="flex gap-2 mb-4">
            <button
              v-for="sns in (profile?.sns_platforms || ['X'])" :key="sns"
              @click="activePlatform = sns"
              :class="['border rounded px-3 py-1 text-sm', activePlatform === sns ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-600']"
            >{{ sns }}</button>
          </div>
          <button
            @click="generatePost"
            :disabled="generatingPost"
            class="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 mb-4"
          >
            {{ generatingPost ? '生成中...' : '投稿文を生成する' }}
          </button>
          <textarea
            v-if="generatedPost"
            v-model="generatedPost"
            rows="6"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
          <div v-if="generatedPost" class="mb-4">
            <label class="block text-sm text-gray-600 mb-1">投稿予定日</label>
            <input
              v-model="scheduledDate"
              type="date"
              class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="flex gap-3">
            <button @click="savePost" v-if="generatedPost" class="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700">保存する</button>
            <button @click="selectedIdea = null; generatedPost = ''" class="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50">閉じる</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: 'ダッシュボード｜SNS Post Calendar' })

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const mobileMenuOpen = ref(false)
const portalLoading = ref(false)
const toast = ref({ show: false, message: '', type: 'success' })
let toastTimer: ReturnType<typeof setTimeout>
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  clearTimeout(toastTimer)
  toast.value = { show: true, message, type }
  toastTimer = setTimeout(() => { toast.value.show = false }, 3000)
}

const { generating, ideas, ideasRemaining, generatedPost } = useGenerationState()
const generatingPost = ref(false)

const profile = ref<any>(null)
const selectedIdea = ref<any>(null)
const activePlatform = ref('X')
const scheduledDate = ref('')
let currentUserId = ''

const now = new Date()
const targetMonth = ref(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return
  currentUserId = session.user.id
  const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
  profile.value = data
})

const generateIdeas = async () => {
  generating.value = true
  ideas.value = []
  try {
    const [year, month] = targetMonth.value.split('-')
    const res = await $fetch('/api/generate-ideas', {
      method: 'POST',
      body: {
        businessType: profile.value.business_type,
        targetAudience: profile.value.target_audience,
        tone: profile.value.tone,
        month: `${year}年${month}月`,
        userId: currentUserId
      }
    })
    ideas.value = (res as any).ideas
    ideasRemaining.value = (res as any).remaining
  } catch (e: any) {
    showToast(`エラー: ${e.data?.message || e.message || JSON.stringify(e)}`, 'error')
  } finally {
    generating.value = false
  }
}

const selectIdea = async (idea: any) => {
  selectedIdea.value = idea
  activePlatform.value = profile.value?.sns_platforms?.[0] || 'X'
  generatedPost.value = ''
  scheduledDate.value = targetMonth.value + '-01'
  await generatePost()
}

const generatePost = async () => {
  generatingPost.value = true
  try {
    const res = await $fetch('/api/generate-post', {
      method: 'POST',
      body: {
        title: selectedIdea.value.title,
        description: selectedIdea.value.description,
        platform: activePlatform.value,
        tone: profile.value?.tone || 'casual',
        userId: currentUserId
      }
    })
    generatedPost.value = (res as any).content
  } catch (e: any) {
    showToast(`エラー: ${e.data?.message || e.message}`, 'error')
  } finally {
    generatingPost.value = false
  }
}

const savePost = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return
  const { error } = await supabase.from('posts').insert({
    user_id: session.user.id,
    title: selectedIdea.value.title,
    content: generatedPost.value,
    category: selectedIdea.value.category,
    sns_platform: activePlatform.value,
    status: 'draft',
    scheduled_date: scheduledDate.value
  })
  if (error) { showToast(`保存エラー: ${error.message}`, 'error'); return }
  selectedIdea.value = null
  generatedPost.value = ''
  showToast('保存しました！')
}

onUnmounted(() => clearTimeout(toastTimer))

const openPortal = async () => {
  portalLoading.value = true
  try {
    const res = await $fetch('/api/stripe/portal', {
      method: 'POST',
      body: { userId: currentUserId }
    })
    window.location.href = (res as any).url
  } catch (e: any) {
    showToast(`エラー: ${e.data?.message || e.message}`, 'error')
    portalLoading.value = false
  }
}

const logout = async () => {
  ideas.value = []
  ideasRemaining.value = null
  await supabase.auth.signOut()
  router.push('/login')
}
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(16px); }
</style>
