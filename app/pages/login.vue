<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold text-center mb-2">SNS Post Calendar</h1>
      <p class="text-gray-500 text-center mb-8">AIが投稿ネタを自動提案します</p>

      <form @submit.prevent="handleAuth" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="6文字以上"
          />
        </div>

        <p v-if="errorMsg" class="text-red-500 text-sm">{{ errorMsg }}</p>
        <p v-if="successMsg" class="text-green-500 text-sm">{{ successMsg }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {{ loading ? '処理中...' : isLogin ? 'ログイン' : 'アカウント作成' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-500 mt-4">
        {{ isLogin ? 'アカウントをお持ちでない方は' : 'すでにアカウントをお持ちの方は' }}
        <button @click="isLogin = !isLogin" class="text-blue-600 hover:underline">
          {{ isLogin ? '新規登録' : 'ログイン' }}
        </button>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const router = useRouter()

const email = ref('')
const password = ref('')
const isLogin = ref(true)
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const handleAuth = async () => {
  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''

  if (isLogin.value) {
    const { error } = await supabase.auth.signInWithPassword({ email: email.value, password: password.value })
    if (error) {
      errorMsg.value = 'メールアドレスまたはパスワードが正しくありません'
    } else {
      router.push('/dashboard')
    }
  } else {
    // 使い捨てメールチェック
    const check = await $fetch('/api/check-email', {
      method: 'POST',
      body: { email: email.value }
    }).catch(() => null)
    if ((check as any)?.isDisposable) {
      errorMsg.value = 'このメールアドレスは使用できません。通常のメールアドレスで登録してください。'
      loading.value = false
      return
    }

    const { error } = await supabase.auth.signUp({ email: email.value, password: password.value })
    if (error) {
      errorMsg.value = error.message
    } else {
      successMsg.value = '確認メールを送信しました。メールをご確認ください。'
    }
  }

  loading.value = false
}
</script>
