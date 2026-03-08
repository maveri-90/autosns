<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b">
      <div class="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="text-xl font-bold text-indigo-600">SNS Post Calendar</NuxtLink>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-4 py-12">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">プライバシーポリシー</h1>

      <div class="bg-white rounded-xl shadow-sm p-8 space-y-8 text-gray-700 leading-relaxed">

        <section>
          <p>SNS Post Calendar（以下「本サービス」）は、ユーザーの個人情報の取り扱いについて、以下のとおりプライバシーポリシーを定めます。</p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-gray-900 mb-3">1. 収集する情報</h2>
          <p>本サービスでは、以下の情報を収集します。</p>
          <ul class="list-disc list-inside mt-2 space-y-1">
            <li>メールアドレス（アカウント登録時）</li>
            <li>業種・ターゲット・SNSプラットフォーム等のプロフィール情報（オンボーディング時）</li>
            <li>決済情報（Stripeを通じて処理。カード情報は本サービスには保存されません）</li>
            <li>サービス利用状況（AI生成回数等）</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-gray-900 mb-3">2. 情報の利用目的</h2>
          <ul class="list-disc list-inside space-y-1">
            <li>本サービスの提供・運営</li>
            <li>AIによる投稿ネタ・投稿文の生成</li>
            <li>サブスクリプションの管理</li>
            <li>サービスの改善・新機能の開発</li>
            <li>お問い合わせへの対応</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-gray-900 mb-3">3. 第三者への提供</h2>
          <p>本サービスは、以下の場合を除き、収集した個人情報を第三者に提供しません。</p>
          <ul class="list-disc list-inside mt-2 space-y-1">
            <li>ユーザーの同意がある場合</li>
            <li>法令に基づく場合</li>
          </ul>
          <p class="mt-3">本サービスでは、以下の外部サービスを利用しています。</p>
          <ul class="list-disc list-inside mt-2 space-y-1">
            <li>Supabase（認証・データベース管理）</li>
            <li>Anthropic（AI生成処理）</li>
            <li>Stripe（決済処理）</li>
            <li>Vercel（ホスティング）</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-gray-900 mb-3">4. Cookieの使用</h2>
          <p>本サービスでは、認証セッションの維持のためにCookieを使用します。ブラウザの設定によりCookieを無効にすることができますが、その場合、本サービスの一部機能が利用できなくなる場合があります。</p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-gray-900 mb-3">5. 広告について</h2>
          <p>本サービスでは、Google AdSenseを利用した広告を掲載する場合があります。Google AdSenseはCookieを使用してユーザーに適切な広告を表示します。詳細はGoogleのプライバシーポリシーをご確認ください。</p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-gray-900 mb-3">6. 個人情報の管理</h2>
          <p>収集した個人情報は適切なセキュリティ対策を講じて管理します。ユーザーはいつでもアカウントを削除することで、登録情報の削除を要求できます。</p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-gray-900 mb-3">7. プライバシーポリシーの変更</h2>
          <p>本プライバシーポリシーは、必要に応じて変更する場合があります。変更後は本ページに掲載します。</p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-gray-900 mb-3">8. お問い合わせ</h2>
          <p>個人情報の取り扱いに関するご質問は、<NuxtLink to="/contact" class="text-indigo-600 hover:underline">お問い合わせページ</NuxtLink>よりご連絡ください。</p>
        </section>

        <section class="text-sm text-gray-500">
          <p>制定日：2026年3月7日</p>
        </section>

      </div>
    </main>

    <footer class="text-center py-8 text-sm text-gray-500">
      <p>© 2026 SNS Post Calendar</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'プライバシーポリシー｜SNS Post Calendar',
  meta: [
    { name: 'description', content: 'SNS Post Calendarのプライバシーポリシーページです。' },
    { name: 'robots', content: 'noindex' }
  ]
})
</script>
