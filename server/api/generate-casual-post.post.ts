import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const PLAN_LIMITS: Record<string, number> = {
  free: 10,
  starter: 50,
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { topic, platform, tone, userId } = body

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
    X: '140文字以内、ハッシュタグ2〜3個、独り言のような気づきや感想として書く',
    Instagram: '300文字以内、絵文字を使い改行多用、ハッシュタグ5〜10個（末尾に）',
    Threads: '200文字以内、友達に話しかけるような緩めの口調'
  }

  const guide = platformGuide[platform] || '200文字以内'

  const prompt = `あなたは個人事業主のSNS運用を支援するコピーライターです。
以下のテーマをもとに、${platform}用の雑談・日常投稿文を1つ作成してください。

【テーマ】${topic}
【トーン】${toneLabel}
【形式】${guide}

【執筆ルール】
- 業種や仕事の話は不要。純粋な日常・趣味・感想の投稿にする
- 「私はこう思う」「正直言うと」など主観・体験ベースで書く
- 読者が「わかる！」「自分も」と思えるような共感を引き出す
- 末尾に読者への問いかけを自然に入れる（「あなたはどう？」等）
- 「いかがでしたか」「〜をご紹介します」などのAI臭い定型文は使わない
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
