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

  const platformGuide = {
    X: '140文字以内、ハッシュタグ2〜3個',
    Instagram: '300文字以内、ハッシュタグ5〜10個、絵文字を使う',
    Threads: '200文字以内、自然な語り口'
  }[platform] || '200文字以内'

  const prompt = `以下のSNS投稿ネタをもとに、${platform}用の投稿文を作成してください。

ネタ: ${title}
概要: ${description}
トーン: ${tone === 'casual' ? 'カジュアル・親しみやすく' : tone === 'formal' ? '丁寧・フォーマル' : '専門的・信頼感'}
形式: ${platformGuide}

投稿文のみを返してください。説明不要。`

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
