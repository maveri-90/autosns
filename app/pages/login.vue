<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold text-center mb-2">SNS Post Calendar</h1>
      <p class="text-gray-500 text-center mb-6">AIが投稿ネタを自動提案します</p>

      <div class="flex rounded-lg border border-gray-200 mb-6">
        <button
          @click="isLogin = true"
          :class="['flex-1 py-2 text-sm font-medium rounded-l-lg transition', isLogin ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50']"
        >ログイン</button>
        <button
          @click="isLogin = false"
          :class="['flex-1 py-2 text-sm font-medium rounded-r-lg transition', !isLogin ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50']"
        >新規登録</button>
      </div>

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

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {{ loading ? '処理中...' : isLogin ? 'ログイン' : 'アカウント作成' }}
        </button>
      </form>


      <div v-if="successMsg" class="mt-4 text-center">
        <p class="text-green-500 text-sm">{{ successMsg }}</p>
        <p class="text-xs text-gray-400 mt-2">
          届かない場合は
          <button @click="resendConfirmation" :disabled="resendLoading" class="text-blue-500 hover:underline disabled:opacity-50">
            {{ resendLoading ? '送信中...' : 'こちら' }}
          </button>
          から再送できます
        </p>
        <p v-if="resendMsg" class="text-green-500 text-xs mt-1">{{ resendMsg }}</p>
        <p v-if="resendError" class="text-red-500 text-xs mt-1">{{ resendError }}</p>
      </div>
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
const resendLoading = ref(false)
const resendMsg = ref('')
const resendError = ref('')

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

    const { error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: { emailRedirectTo: 'https://autosns-umber.vercel.app/auth/confirm' }
    })
    if (error) {
      errorMsg.value = error.message
    } else {
      successMsg.value = '確認メールを送信しました。メールをご確認ください。'
    }
  }

  loading.value = false
}

const resendConfirmation = async () => {
  if (!email.value) {
    resendError.value = '上のメールアドレスを入力してから押してください'
    return
  }
  resendLoading.value = true
  resendMsg.value = ''
  resendError.value = ''
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email.value
  })
  if (error) {
    resendError.value = '送信に失敗しました'
  } else {
    resendMsg.value = `${email.value} に再送しました`
  }
  resendLoading.value = false
}
</script>
