<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm px-4 py-4 flex justify-between items-center">
      <h1 class="text-xl font-bold text-blue-600">SNS Post Calendar</h1>
      <div class="flex items-center gap-4">
        <NuxtLink to="/dashboard" class="text-sm text-gray-500 hover:underline">← ダッシュボードへ戻る</NuxtLink>
        <button @click="logout" class="text-sm text-gray-500 hover:text-gray-700">ログアウト</button>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-6 py-8">
      <!-- 月切り替え -->
      <div class="flex items-center justify-between mb-6">
        <button @click="prevMonth" class="p-2 hover:bg-gray-200 rounded-lg">←</button>
        <h2 class="text-xl font-bold">{{ currentYear }}年 {{ currentMonth }}月</h2>
        <button @click="nextMonth" class="p-2 hover:bg-gray-200 rounded-lg">→</button>
      </div>

      <!-- カレンダーグリッド -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <!-- 曜日ヘッダー -->
        <div class="grid grid-cols-7 border-b">
          <div v-for="day in weekDays" :key="day"
            class="py-3 text-center text-sm font-medium text-gray-500">
            {{ day }}
          </div>
        </div>

        <!-- 日付グリッド -->
        <div class="grid grid-cols-7">
          <div
            v-for="(cell, index) in calendarCells" :key="index"
            class="min-h-24 border-b border-r p-2 relative"
            :class="{ 'bg-gray-50': !cell.day, 'bg-blue-50': cell.isToday }"
          >
            <span v-if="cell.day"
              class="text-sm font-medium"
              :class="cell.isToday ? 'text-blue-600' : 'text-gray-700'"
            >
              {{ cell.day }}
            </span>

            <!-- その日の投稿 -->
            <div v-for="post in cell.posts" :key="post.id"
              class="mt-1 text-xs rounded px-1.5 py-1 cursor-pointer truncate"
              :class="statusColor(post.status)"
              @click="selectPost(post)"
            >
              {{ post.title }}
            </div>
          </div>
        </div>
      </div>

      <!-- 凡例 -->
      <div class="flex gap-4 mt-4 text-xs text-gray-500">
        <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-yellow-100 border border-yellow-300 inline-block"></span>下書き</span>
        <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-blue-100 border border-blue-300 inline-block"></span>確認済み</span>
        <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-green-100 border border-green-300 inline-block"></span>投稿済み</span>
      </div>
    </main>

    <!-- 投稿詳細モーダル -->
    <div v-if="selectedPost" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4">
        <h3 class="font-bold text-lg mb-1">{{ selectedPost.title }}</h3>
        <div class="flex gap-2 mb-3">
          <span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{{ selectedPost.sns_platform }}</span>
          <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{{ selectedPost.category }}</span>
        </div>
        <textarea
          v-model="selectedPost.content"
          rows="6"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        <div class="flex gap-2 mb-4">
          <button
            v-for="s in statuses" :key="s.value"
            @click="selectedPost.status = s.value"
            :class="['border rounded px-3 py-1 text-xs font-medium transition', selectedPost.status === s.value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-600']"
          >{{ s.label }}</button>
        </div>
        <div class="flex gap-3">
          <button @click="updatePost" class="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700">保存</button>
          <button @click="deletePost" class="border border-red-300 text-red-600 px-4 py-2 rounded-lg text-sm hover:bg-red-50">削除</button>
          <button @click="selectedPost = null" class="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50">閉じる</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const supabase = useSupabaseClient()
const router = useRouter()

const now = new Date()
const currentYear = ref(now.getFullYear())
const currentMonth = ref(now.getMonth() + 1)
const posts = ref<any[]>([])
const selectedPost = ref<any>(null)

const weekDays = ['日', '月', '火', '水', '木', '金', '土']
const statuses = [
  { value: 'draft', label: '下書き' },
  { value: 'approved', label: '確認済み' },
  { value: 'posted', label: '投稿済み' }
]

const statusColor = (status: string) => {
  if (status === 'posted') return 'bg-green-100 text-green-700 border border-green-200'
  if (status === 'approved') return 'bg-blue-100 text-blue-700 border border-blue-200'
  return 'bg-yellow-100 text-yellow-700 border border-yellow-200'
}

const calendarCells = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value - 1, 1).getDay()
  const daysInMonth = new Date(currentYear.value, currentMonth.value, 0).getDate()
  const today = new Date()
  const cells = []

  for (let i = 0; i < firstDay; i++) cells.push({ day: null, posts: [], isToday: false })

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const dayPosts = posts.value.filter(p => p.scheduled_date === dateStr)
    const isToday = today.getFullYear() === currentYear.value && today.getMonth() + 1 === currentMonth.value && today.getDate() === d
    cells.push({ day: d, posts: dayPosts, isToday })
  }

  return cells
})

const loadPosts = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return
  const from = `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-01`
  const to = `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-31`
  const { data } = await supabase.from('posts')
    .select('*')
    .eq('user_id', session.user.id)
    .gte('scheduled_date', from)
    .lte('scheduled_date', to)
  posts.value = data || []
}

const prevMonth = () => {
  if (currentMonth.value === 1) { currentMonth.value = 12; currentYear.value-- }
  else currentMonth.value--
  loadPosts()
}

const nextMonth = () => {
  if (currentMonth.value === 12) { currentMonth.value = 1; currentYear.value++ }
  else currentMonth.value++
  loadPosts()
}

const selectPost = (post: any) => {
  selectedPost.value = { ...post }
}

const updatePost = async () => {
  await supabase.from('posts').update({
    content: selectedPost.value.content,
    status: selectedPost.value.status
  }).eq('id', selectedPost.value.id)
  await loadPosts()
  selectedPost.value = null
}

const deletePost = async () => {
  if (!confirm('この投稿を削除しますか？')) return
  await supabase.from('posts').delete().eq('id', selectedPost.value.id)
  await loadPosts()
  selectedPost.value = null
}

const logout = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}

onMounted(loadPosts)
</script>
