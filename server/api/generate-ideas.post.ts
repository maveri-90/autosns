import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const FREE_LIMIT = 3

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { businessType, targetAudience, tone, month, userId } = body

  if (!userId) {
    throw createError({ statusCode: 401, message: '認証が必要です' })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, ideas_count, ideas_reset_at')
    .eq('id', userId)
    .single()

  if (profile && profile.plan !== 'pro') {
    const today = new Date()
    const resetAt = profile.ideas_reset_at ? new Date(profile.ideas_reset_at) : null
    const isNewMonth = !resetAt ||
      resetAt.getFullYear() !== today.getFullYear() ||
      resetAt.getMonth() !== today.getMonth()

    if (isNewMonth) {
      await supabase.from('profiles').update({
        ideas_count: 0,
        ideas_reset_at: today.toISOString().slice(0, 10)
      }).eq('id', userId)
      profile.ideas_count = 0
    }

    if ((profile.ideas_count || 0) >= FREE_LIMIT) {
      throw createError({
        statusCode: 429,
        message: `フリープランのネタ生成は月${FREE_LIMIT}回までです。プロプランにアップグレードしてください。`
      })
    }
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const prompt = `あなたはSNS運用の専門家です。以下の条件で${month}の月間SNS投稿ネタを20件提案してください。

業種: ${businessType}
ターゲット: ${targetAudience}
トーン: ${tone === 'casual' ? 'カジュアル' : tone === 'formal' ? '丁寧' : '専門的'}

以下のカテゴリをバランスよく含めてください：
- 実績・事例紹介
- 豆知識・Tips
- お客様の声・Q&A
- キャンペーン・お知らせ
- 季節・トレンド

必ずJSON形式で返してください：
{
  "ideas": [
    {
      "title": "投稿タイトル（20文字以内）",
      "category": "カテゴリ名",
      "description": "投稿の概要（50文字以内）"
    }
  ]
}`

  let message
  try {
    message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    })
  } catch (e: any) {
    console.error('Anthropic API error:', e)
    throw createError({ statusCode: 400, message: `Anthropic APIエラー: ${e.message}` })
  }

  if (profile && profile.plan !== 'pro') {
    await supabase.from('profiles').update({
      ideas_count: (profile.ideas_count || 0) + 1
    }).eq('id', userId)
  }

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw createError({ statusCode: 500, message: 'AI応答の解析に失敗しました' })
  }

  const result = JSON.parse(jsonMatch[0])
  const remaining = profile?.plan === 'pro' ? null : FREE_LIMIT - (profile?.ideas_count || 0) - 1
  return { ...result, remaining }
})
