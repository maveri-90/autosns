<template>
  <div class="min-h-screen bg-white">

    <!-- ナビゲーション -->
    <header class="px-6 py-4 flex justify-between items-center max-w-6xl mx-auto">
      <div class="text-xl font-bold text-blue-600">SNS Post Calendar</div>
      <div class="flex items-center gap-4">
        <NuxtLink to="/login" class="text-sm text-gray-500 hover:text-gray-700">ログイン</NuxtLink>
        <NuxtLink to="/login" class="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700">無料で始める</NuxtLink>
      </div>
    </header>

    <!-- ヒーローセクション -->
    <section class="max-w-4xl mx-auto px-6 py-20 text-center">
      <span class="inline-block bg-blue-50 text-blue-600 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
        AIが月の投稿計画をまるごとサポート
      </span>
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
        SNS投稿、<br class="md:hidden">毎月<span class="text-blue-600">ネタ切れ</span>してませんか？
      </h1>
      <p class="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
        業種・ターゲット・トーンを設定するだけで、AIが今月の投稿ネタを20件提案。カレンダーで計画を立てて、SNS運用をラクに続けられます。
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink to="/login" class="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-200">
          無料で試してみる
        </NuxtLink>
        <a href="#how-it-works" class="border border-gray-300 text-gray-600 px-8 py-4 rounded-xl font-medium text-lg hover:bg-gray-50">
          使い方を見る
        </a>
      </div>
      <p class="text-xs text-gray-400 mt-4">クレジットカード不要・登録2分</p>
    </section>

    <!-- こんな人に -->
    <section class="bg-gray-50 py-16">
      <div class="max-w-4xl mx-auto px-6">
        <h2 class="text-2xl font-bold text-center mb-10 text-gray-800">こんなお悩みありませんか？</h2>
        <div class="grid md:grid-cols-3 gap-6">
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="text-3xl mb-3">😔</div>
            <h3 class="font-bold mb-2">ネタが思い浮かばない</h3>
            <p class="text-sm text-gray-500">「今月何を投稿しよう…」と毎回悩んで、結局投稿できない</p>
          </div>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="text-3xl mb-3">⏰</div>
            <h3 class="font-bold mb-2">投稿文を考える時間がない</h3>
            <p class="text-sm text-gray-500">本業が忙しくて、SNSに割ける時間がほとんどない</p>
          </div>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="text-3xl mb-3">📅</div>
            <h3 class="font-bold mb-2">計画的に投稿できない</h3>
            <p class="text-sm text-gray-500">思い出したときだけ投稿して、フォロワーが増えない</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 使い方 -->
    <section id="how-it-works" class="py-20 max-w-4xl mx-auto px-6">
      <h2 class="text-2xl font-bold text-center mb-3 text-gray-800">3ステップで今月の投稿計画が完成</h2>
      <p class="text-center text-gray-500 mb-12">難しい設定は一切なし。業種を選ぶだけでOK。</p>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="text-center">
          <div class="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
          <h3 class="font-bold mb-2">業種・ターゲットを設定</h3>
          <p class="text-sm text-gray-500">カフェ・美容室・フリーランスなど業種を選ぶだけ。ターゲット層とトーンも設定できます。</p>
        </div>
        <div class="text-center">
          <div class="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
          <h3 class="font-bold mb-2">AIがネタを20件提案</h3>
          <p class="text-sm text-gray-500">ボタン1つで今月の投稿ネタを自動生成。実績紹介・Tips・季節ネタなどバランスよく提案。</p>
        </div>
        <div class="text-center">
          <div class="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
          <h3 class="font-bold mb-2">投稿文を生成してカレンダー管理</h3>
          <p class="text-sm text-gray-500">X・Instagram・Threads用の投稿文を生成。カレンダーで投稿スケジュールを一元管理。</p>
        </div>
      </div>
    </section>

    <!-- 対応SNS -->
    <section class="bg-gray-50 py-16">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-2xl font-bold mb-3 text-gray-800">主要SNSに対応</h2>
        <p class="text-gray-500 mb-8">各SNSの文字数・ハッシュタグ数に最適化した投稿文を生成します</p>
        <div class="flex justify-center gap-8 flex-wrap">
          <div class="bg-white rounded-xl px-8 py-4 shadow-sm font-bold text-gray-700">𝕏 (Twitter)</div>
          <div class="bg-white rounded-xl px-8 py-4 shadow-sm font-bold text-gray-700">Instagram</div>
          <div class="bg-white rounded-xl px-8 py-4 shadow-sm font-bold text-gray-700">Threads</div>
        </div>
      </div>
    </section>

    <!-- 料金 -->
    <section class="py-20 max-w-5xl mx-auto px-6">
      <h2 class="text-2xl font-bold text-center mb-3 text-gray-800">シンプルな料金プラン</h2>
      <p class="text-center text-gray-500 mb-12">まずは無料で試してください</p>
      <div class="grid md:grid-cols-3 gap-6">
        <div class="border border-gray-200 rounded-xl p-8">
          <h3 class="text-xl font-bold mb-2">フリー</h3>
          <div class="text-4xl font-bold mb-6">¥0</div>
          <ul class="space-y-2 text-sm text-gray-600 mb-8">
            <li class="flex items-center gap-2"><span class="text-green-500">✓</span> AIネタ生成（月3回）</li>
            <li class="flex items-center gap-2"><span class="text-green-500">✓</span> 投稿文生成（月10回）</li>
            <li class="flex items-center gap-2"><span class="text-green-500">✓</span> 投稿カレンダー</li>
          </ul>
          <NuxtLink to="/login" class="block text-center border border-gray-300 text-gray-600 py-3 rounded-lg text-sm hover:bg-gray-50">
            無料で始める
          </NuxtLink>
        </div>
        <div class="border border-gray-200 rounded-xl p-8">
          <h3 class="text-xl font-bold mb-2">スターター</h3>
          <div class="text-4xl font-bold mb-1">¥490</div>
          <p class="text-gray-400 text-sm mb-6">/ 月（税込）</p>
          <ul class="space-y-2 text-sm text-gray-600 mb-8">
            <li class="flex items-center gap-2"><span class="text-green-500">✓</span> AIネタ生成（月30回）</li>
            <li class="flex items-center gap-2"><span class="text-green-500">✓</span> 投稿文生成（月50回）</li>
            <li class="flex items-center gap-2"><span class="text-green-500">✓</span> 投稿カレンダー</li>
            <li class="flex items-center gap-2"><span class="text-green-500">✓</span> 複数SNS対応</li>
          </ul>
          <NuxtLink to="/pricing" class="block text-center bg-gray-800 text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-900">
            スタータープランで始める
          </NuxtLink>
        </div>
        <div class="border-2 border-blue-500 rounded-xl p-8 relative">
          <span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">おすすめ</span>
          <h3 class="text-xl font-bold mb-2">プロ</h3>
          <div class="text-4xl font-bold mb-1">¥1,980</div>
          <p class="text-gray-400 text-sm mb-6">/ 月（税込）</p>
          <ul class="space-y-2 text-sm text-gray-600 mb-8">
            <li class="flex items-center gap-2"><span class="text-green-500">✓</span> AIネタ生成（無制限）</li>
            <li class="flex items-center gap-2"><span class="text-green-500">✓</span> 投稿文生成（無制限）</li>
            <li class="flex items-center gap-2"><span class="text-green-500">✓</span> 投稿カレンダー</li>
            <li class="flex items-center gap-2"><span class="text-green-500">✓</span> 複数SNS対応</li>
            <li class="flex items-center gap-2"><span class="text-green-500">✓</span> 優先サポート</li>
          </ul>
          <NuxtLink to="/pricing" class="block text-center bg-blue-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-blue-700">
            プロプランで始める
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-blue-600 py-20 text-center text-white">
      <h2 class="text-3xl font-bold mb-4">SNS運用、もう悩まなくていい。</h2>
      <p class="text-blue-100 mb-8">今月の投稿計画を、今すぐAIと一緒に作りましょう。</p>
      <NuxtLink to="/login" class="bg-white text-blue-600 font-bold px-8 py-4 rounded-xl text-lg hover:bg-blue-50 inline-block">
        無料で始める（2分で登録）
      </NuxtLink>
    </section>

    <!-- フッター -->
    <footer class="py-8 text-center text-sm text-gray-400">
      <div class="flex justify-center gap-6 mb-3">
        <NuxtLink to="/privacy" class="hover:text-gray-600">プライバシーポリシー</NuxtLink>
        <NuxtLink to="/contact" class="hover:text-gray-600">お問い合わせ</NuxtLink>
      </div>
      <p>© 2026 SNS Post Calendar</p>
    </footer>

  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'SNS Post Calendar｜AIがSNS投稿ネタを自動提案',
  meta: [
    { name: 'description', content: '業種・ターゲットを設定するだけでAIが今月の投稿ネタを20件提案。X・Instagram・Threads対応の投稿文を自動生成し、カレンダーでスケジュール管理。個人事業主・フリーランスのSNS運用を効率化。' },
    { name: 'keywords', content: 'SNS投稿 自動生成, SNS運用 AI, 投稿ネタ 自動, SNSカレンダー, 個人事業主 SNS, Instagram 投稿文 自動生成, X Twitter 投稿自動化' },
    { property: 'og:title', content: 'SNS Post Calendar｜AIがSNS投稿ネタを自動提案' },
    { property: 'og:description', content: '業種・ターゲットを設定するだけでAIが今月の投稿ネタを20件提案。SNS運用をラクにするAIツール。' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://autosns-umber.vercel.app' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'SNS Post Calendar｜AIがSNS投稿ネタを自動提案' },
    { name: 'twitter:description', content: '業種を設定するだけでAIが投稿ネタを20件提案。X・Instagram・Threads対応。' },
  ],
  link: [
    { rel: 'canonical', href: 'https://autosns-umber.vercel.app' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'SNS Post Calendar',
        applicationCategory: 'BusinessApplication',
        description: 'AIがSNS投稿ネタを自動提案・投稿文を自動生成するサービス。個人事業主・フリーランスのSNS運用を効率化。',
        offers: [
          { '@type': 'Offer', price: '0', priceCurrency: 'JPY', name: 'フリープラン' },
          { '@type': 'Offer', price: '490', priceCurrency: 'JPY', name: 'スタータープラン' },
          { '@type': 'Offer', price: '1980', priceCurrency: 'JPY', name: 'プロプラン' }
        ],
        url: 'https://autosns-umber.vercel.app',
        inLanguage: 'ja'
      })
    }
  ]
})

// ログイン済みの場合はダッシュボードへリダイレクト
const user = useSupabaseUser()
watchEffect(() => {
  if (user.value) navigateTo('/dashboard')
})
</script>
