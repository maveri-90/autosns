<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
      <h1 class="text-2xl font-bold mb-2">はじめに設定しましょう</h1>
      <p class="text-gray-500 mb-8">あなたのビジネスに合ったネタを提案します</p>

      <form @submit.prevent="saveProfile" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">業種</label>
          <select v-model="selectedCategory" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">選択してください</option>
            <optgroup label="飲食・食品">
              <option value="カフェ・コーヒーショップ">カフェ・コーヒーショップ</option>
              <option value="レストラン・飲食店">レストラン・飲食店</option>
              <option value="居酒屋・バー">居酒屋・バー</option>
              <option value="ベーカリー・スイーツ店">ベーカリー・スイーツ店</option>
              <option value="フードデリバリー">フードデリバリー</option>
            </optgroup>
            <optgroup label="美容・ヘルス">
              <option value="美容室・ヘアサロン">美容室・ヘアサロン</option>
              <option value="ネイルサロン">ネイルサロン</option>
              <option value="エステ・脱毛サロン">エステ・脱毛サロン</option>
              <option value="整体・マッサージ">整体・マッサージ</option>
              <option value="パーソナルトレーナー">パーソナルトレーナー</option>
              <option value="ヨガ・ピラティス">ヨガ・ピラティス</option>
            </optgroup>
            <optgroup label="クリエイター・IT">
              <option value="フリーランスエンジニア">フリーランスエンジニア</option>
              <option value="Webデザイナー">Webデザイナー</option>
              <option value="グラフィックデザイナー">グラフィックデザイナー</option>
              <option value="動画クリエイター・YouTuber">動画クリエイター・YouTuber</option>
              <option value="フォトグラファー">フォトグラファー</option>
              <option value="ライター・コピーライター">ライター・コピーライター</option>
            </optgroup>
            <optgroup label="ビジネス・コンサル">
              <option value="コンサルタント">コンサルタント</option>
              <option value="税理士・会計士">税理士・会計士</option>
              <option value="社労士・行政書士">社労士・行政書士</option>
              <option value="コーチ・メンター">コーチ・メンター</option>
              <option value="マーケター">マーケター</option>
            </optgroup>
            <optgroup label="教育・習い事">
              <option value="学習塾・家庭教師">学習塾・家庭教師</option>
              <option value="語学スクール">語学スクール</option>
              <option value="音楽教室">音楽教室</option>
              <option value="料理教室">料理教室</option>
              <option value="オンラインスクール">オンラインスクール</option>
            </optgroup>
            <optgroup label="小売・EC">
              <option value="ネットショップ・EC">ネットショップ・EC</option>
              <option value="アパレル・ファッション">アパレル・ファッション</option>
              <option value="ハンドメイド・クラフト">ハンドメイド・クラフト</option>
              <option value="雑貨・インテリア">雑貨・インテリア</option>
            </optgroup>
            <optgroup label="不動産・建設">
              <option value="不動産仲介">不動産仲介</option>
              <option value="工務店・リフォーム">工務店・リフォーム</option>
              <option value="インテリアコーディネーター">インテリアコーディネーター</option>
            </optgroup>
            <optgroup label="医療・福祉">
              <option value="歯科医院">歯科医院</option>
              <option value="クリニック・病院">クリニック・病院</option>
              <option value="薬局・ドラッグストア">薬局・ドラッグストア</option>
              <option value="介護・福祉施設">介護・福祉施設</option>
            </optgroup>
            <option value="その他">その他（自由入力）</option>
          </select>
          <input
            v-if="selectedCategory === 'その他'"
            v-model="form.businessType"
            type="text"
            required
            placeholder="例：占い師、ウェディングプランナー"
            class="mt-2 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">ターゲット層</label>
          <input
            v-model="form.targetAudience"
            type="text"
            required
            placeholder="例：30代女性、子育て中のママ"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">投稿のトーン</label>
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="t in tones" :key="t.value" type="button"
              @click="form.tone = t.value"
              :class="['border rounded-lg px-4 py-3 text-sm font-medium transition', form.tone === t.value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-600 hover:border-gray-400']"
            >
              {{ t.label }}
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">使用するSNS</label>
          <div class="flex gap-3">
            <button
              v-for="sns in snsList" :key="sns"
              type="button"
              @click="toggleSns(sns)"
              :class="['border rounded-lg px-4 py-2 text-sm font-medium transition', form.snsPlatforms.includes(sns) ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-600 hover:border-gray-400']"
            >
              {{ sns }}
            </button>
          </div>
        </div>

        <p v-if="errorMsg" class="text-red-500 text-sm">{{ errorMsg }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {{ loading ? '保存中...' : '設定を保存してはじめる' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const form = reactive({
  businessType: '',
  targetAudience: '',
  tone: 'casual',
  snsPlatforms: ['X'] as string[]
})

const knownCategories = [
  'カフェ・コーヒーショップ','レストラン・飲食店','居酒屋・バー','ベーカリー・スイーツ店','フードデリバリー',
  '美容室・ヘアサロン','ネイルサロン','エステ・脱毛サロン','整体・マッサージ','パーソナルトレーナー','ヨガ・ピラティス',
  'フリーランスエンジニア','Webデザイナー','グラフィックデザイナー','動画クリエイター・YouTuber','フォトグラファー','ライター・コピーライター',
  'コンサルタント','税理士・会計士','社労士・行政書士','コーチ・メンター','マーケター',
  '学習塾・家庭教師','語学スクール','音楽教室','料理教室','オンラインスクール',
  'ネットショップ・EC','アパレル・ファッション','ハンドメイド・クラフト','雑貨・インテリア',
  '不動産仲介','工務店・リフォーム','インテリアコーディネーター',
  '歯科医院','クリニック・病院','薬局・ドラッグストア','介護・福祉施設'
]

const selectedCategory = ref('')

watch(selectedCategory, (val) => {
  if (val !== 'その他') form.businessType = val
  else form.businessType = ''
})

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return
  const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
  if (data) {
    const saved = data.business_type || ''
    if (knownCategories.includes(saved)) {
      selectedCategory.value = saved
    } else if (saved) {
      selectedCategory.value = 'その他'
      form.businessType = saved
    }
    form.targetAudience = data.target_audience || ''
    form.tone = data.tone || 'casual'
    form.snsPlatforms = data.sns_platforms || ['X']
  }
})

const tones = [
  { value: 'casual', label: 'カジュアル' },
  { value: 'formal', label: '丁寧' },
  { value: 'professional', label: '専門的' }
]

const snsList = ['X', 'Instagram', 'Threads']
const loading = ref(false)
const errorMsg = ref('')

const toggleSns = (sns: string) => {
  const idx = form.snsPlatforms.indexOf(sns)
  if (idx > -1) {
    if (form.snsPlatforms.length > 1) form.snsPlatforms.splice(idx, 1)
  } else {
    form.snsPlatforms.push(sns)
  }
}

const saveProfile = async () => {
  loading.value = true
  errorMsg.value = ''

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    errorMsg.value = 'セッションが切れています。再ログインしてください。'
    loading.value = false
    router.push('/login')
    return
  }

  const { error } = await supabase.from('profiles').upsert({
    id: session.user.id,
    business_type: form.businessType,
    target_audience: form.targetAudience,
    tone: form.tone,
    sns_platforms: form.snsPlatforms
  })

  if (error) {
    errorMsg.value = `保存に失敗しました: ${error.message}`
  } else {
    router.push('/dashboard')
  }

  loading.value = false
}
</script>
