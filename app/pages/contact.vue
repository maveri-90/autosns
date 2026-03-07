<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b">
      <div class="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="text-xl font-bold text-indigo-600">SNS Post Calendar</NuxtLink>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-4 py-12">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">お問い合わせ</h1>
      <p class="text-gray-500 mb-8">ご質問・ご要望・不具合報告などお気軽にご連絡ください。</p>

      <div class="bg-white rounded-xl shadow-sm p-8">
        <div v-if="submitted" class="text-center py-8">
          <div class="text-5xl mb-4">✅</div>
          <h2 class="text-xl font-bold text-gray-900 mb-2">送信しました</h2>
          <p class="text-gray-500">内容を確認のうえ、折り返しご連絡いたします。</p>
          <NuxtLink to="/" class="mt-6 inline-block text-indigo-600 hover:underline">トップページへ戻る</NuxtLink>
        </div>

        <form v-else @submit.prevent="submit" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">お名前</label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="山田 太郎"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="example@email.com"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">お問い合わせ種別</label>
            <select
              v-model="form.category"
              required
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">選択してください</option>
              <option value="bug">不具合・エラー報告</option>
              <option value="feature">機能のご要望</option>
              <option value="billing">料金・決済について</option>
              <option value="other">その他</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">お問い合わせ内容</label>
            <textarea
              v-model="form.message"
              required
              rows="6"
              placeholder="お問い合わせ内容をご記入ください"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {{ loading ? '送信中...' : '送信する' }}
          </button>

          <p v-if="errorMsg" class="text-red-500 text-sm text-center">{{ errorMsg }}</p>
        </form>
      </div>
    </main>

    <footer class="text-center py-8 text-sm text-gray-500">
      <p>© 2026 SNS Post Calendar</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
const form = reactive({
  name: '',
  email: '',
  category: '',
  message: ''
})

const loading = ref(false)
const submitted = ref(false)
const errorMsg = ref('')

async function submit() {
  loading.value = true
  errorMsg.value = ''
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: form
    })
    submitted.value = true
  } catch {
    errorMsg.value = '送信に失敗しました。時間をおいて再度お試しください。'
  } finally {
    loading.value = false
  }
}
</script>
