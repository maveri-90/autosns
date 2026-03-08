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

      <!-- Googleログイン -->
      <button
        @click="loginWithGoogle"
        :disabled="googleLoading"
        class="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 mb-4"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="w-5 h-5">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        {{ googleLoading ? '処理中...' : 'Googleでログイン' }}
      </button>

      <div class="flex items-center gap-3 mb-4">
        <div class="flex-1 border-t border-gray-200"></div>
        <span class="text-xs text-gray-400">または</span>
        <div class="flex-1 border-t border-gray-200"></div>
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
useHead({ title: 'ログイン｜SNS Post Calendar' })
const supabase = useSupabaseClient()
const router = useRouter()

const email = ref('')
const password = ref('')
const isLogin = ref(true)
const loading = ref(false)
const googleLoading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const resendLoading = ref(false)
const resendMsg = ref('')
const resendError = ref('')

const loginWithGoogle = async () => {
  googleLoading.value = true
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: 'https://autosns-umber.vercel.app/auth/callback' }
  })
  if (error) errorMsg.value = 'Googleログインに失敗しました'
  googleLoading.value = false
}

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
    email: email.value,
    options: { emailRedirectTo: 'https://autosns-umber.vercel.app/auth/confirm' }
  })
  if (error) {
    resendError.value = `送信に失敗しました（${error.message}）`
  } else {
    resendMsg.value = `${email.value} に再送しました`
  }
  resendLoading.value = false
}
</script>
