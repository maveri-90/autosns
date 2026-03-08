import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const PLAN_LIMITS: Record<string, number> = {
  free: 10,
  starter: 50,
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { title, description, platform, tone, userId } = body

  if (!userId) {
    throw createError({ statusCode: 401, message: '認証が必要です' })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, posts_count, posts_reset_at')
    .eq('id', userId)
    .single()

  if (profile && profile.plan !== 'pro') {
    const limit = PLAN_LIMITS[profile.plan] ?? PLAN_LIMITS.free
    const today = new Date()
    const resetAt = profile.posts_reset_at ? new Date(profile.posts_reset_at) : null
    const isNewMonth = !resetAt ||
      resetAt.getFullYear() !== today.getFullYear() ||
      resetAt.getMonth() !== today.getMonth()

    if (isNewMonth) {
      await supabase.from('profiles').update({
        posts_count: 0,
        posts_reset_at: today.toISOString().slice(0, 10)
      }).eq('id', userId)
      profile.posts_count = 0
    }

    if ((profile.posts_count || 0) >= limit) {
      const planName = profile.plan === 'starter' ? 'スタータープラン' : 'フリープラン'
      throw createError({
        statusCode: 429,
        message: `${planName}の投稿文生成は月${limit}回までです。上位プランにアップグレードしてください。`
      })
    }
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const toneLabel = tone === 'casual' ? 'カジュアル・親しみやすく' : tone === 'formal' ? '丁寧・フォーマル' : '専門的・信頼感'

  const platformGuide: Record<string, string> = {
    X: `【X(Twitter)用 構成】
① 冒頭フック（1〜2行）: 読者の悩みや共感を引く一言。疑問形・断言・数字を使う
② 本文（3〜5行）: 具体的なTipsや気づきをテンポよく。「私はこう思う」「正直に言うと」などの主観表現を自然に混ぜる
③ まとめ（1行）: 一言で価値を凝縮
④ CTA（1行）: 「保存して見返してね」「あなたはどう思う？」「共感したらRT」など読者に問いかける形で締める
⑤ ハッシュタグ: 2〜3個
※全体140文字以内`,
    Instagram: `【Instagram用 構成】
① 冒頭フック（1行）: スクロールが止まる一言。「〇〇な人へ」「実は〇〇って知ってた？」形式
② 本文（5〜8行）: 絵文字を使い読みやすく。改行を多用してテンポを出す。「私の場合は〜」「正直これ、最初は失敗してたんですよね」など主観・体験談を交える
③ まとめ（1〜2行）: 投稿の価値をひと言で
④ CTA（1行）: 「保存必須✅」「あなたはどうですか？コメントで教えて💬」など問いかけで締める
⑤ ハッシュタグ: 5〜10個（投稿末尾に）
※全体300文字以内`,
    Threads: `【Threads用 構成】
① 冒頭フック（1行）: 思わず続きを読みたくなる問いかけや事実
② 本文（3〜5行）: 友達に話しかけるような緩めの口調。「私これよくやっちゃうんですけど」「ぶっちゃけ〜」など体温のある表現を使う
③ CTA（1行）: 「どう思う？コメントで教えて」「フォローすると毎週こういう投稿が届くよ」など
※全体200文字以内`
  }

  const guide = platformGuide[platform] || '200文字以内で投稿文を作成してください。'

  const prompt = `あなたは、個人事業主のSNS運用を支援するプロのコピーライターです。
以下のネタをもとに、「AIが書いた」ではなく「この人が今日書いた」と感じさせる${platform}用の投稿文を1つ作成してください。

【ネタ】${title}
【概要】${description}
【トーン】${toneLabel}

${guide}

【厳守ルール】
- 「いかがでしたか」「〜をご紹介します」「〜してみませんか」などのAI臭い定型文は絶対に使わない
- 冒頭の1行目で読者の悩みや興味を引く「フック」を必ず入れる
- 「私はこう思う」「正直言うと」「実は〜」など主観・体験ベースの表現を自然に混ぜる
- CTAは読者への問いかけ（「あなたはどう？」等）を含め、押しつけがましくなく締める
- 投稿文のみを返すこと。説明・前置き不要。`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }]
  })

  if (profile && profile.plan !== 'pro') {
    await supabase.from('profiles').update({
      posts_count: (profile.posts_count || 0) + 1
    }).eq('id', userId)
  }

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  return { content: text }
})
