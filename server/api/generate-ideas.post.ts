import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const PLAN_LIMITS: Record<string, number> = {
  free: 3,
  starter: 30,
}

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
    const limit = PLAN_LIMITS[profile.plan] ?? PLAN_LIMITS.free
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

    if ((profile.ideas_count || 0) >= limit) {
      const planName = profile.plan === 'starter' ? 'スタータープラン' : 'フリープラン'
      throw createError({
        statusCode: 429,
        message: `${planName}のネタ生成は月${limit}回までです。上位プランにアップグレードしてください。`
      })
    }
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const toneLabel = tone === 'casual' ? 'カジュアル・親しみやすく' : tone === 'formal' ? '丁寧・フォーマル' : '専門的・信頼感'

  // 月ごとの季節キーワードを自動付加
  const monthNum = parseInt(month.replace(/[^0-9]/g, '').slice(-2) || month.split('年')[1]?.replace('月', '') || '1')
  const seasonalKeywords: Record<number, string> = {
    1: '新年・お正月・初詣・成人式・冬の寒さ・年始の抱負',
    2: '節分・バレンタイン・春の足音・確定申告シーズン',
    3: '卒業・年度末・桜の準備・新生活の予感・確定申告',
    4: '新生活・入学・新年度・花見・スタートダッシュ',
    5: 'GW・こどもの日・母の日・初夏・連休明けの疲れ',
    6: '梅雨・父の日・夏の準備・ジメジメ対策',
    7: '七夕・夏本番・暑さ対策・夏休み前',
    8: 'お盆・夏休み・猛暑・夏の疲れ・残暑',
    9: '新学期・秋の気配・9月病・食欲の秋',
    10: 'ハロウィン・秋本番・読書の秋・行楽シーズン',
    11: '紅葉・文化の日・年末準備・いい夫婦の日',
    12: '師走・クリスマス・年末・大掃除・忘年会・来年への抱負',
  }
  const seasonal = seasonalKeywords[monthNum] || ''

  const prompt = `あなたは、個人事業主の売上を最大化させるSNS戦略コンサルタントです。
以下の条件に基づき、ターゲットが「つい手を止めてしまう」${month}の月間投稿ネタを20件提案してください。

【基本情報】
業種: ${businessType}
ターゲット: ${targetAudience}
投稿トーン: ${toneLabel}
${seasonal ? `${month}の季節・時事キーワード: ${seasonal}` : ''}

【戦略的カテゴリ配分（合計20件）】
- 権威性（4件）: 実績・事例・専門スキルの証明
- 親近感（4件）: 仕事へのこだわり・失敗からの学び・最近感動したこと・業種ならではの「あるある」など、人柄が伝わる雑談ネタ。「実はこんなことがあって…」形式が効果的
- 有益性（8件）: ターゲットの悩みを解決するTips・豆知識・Q&A
- トレンド/季節（2件）: 上記の季節・時事キーワードを絡めた${month}ならではのネタ
- アクション（2件）: お知らせ・キャンペーン・相談への誘導

【出力ルール】
- descriptionには「なぜこのネタがターゲットに刺さるのか」という狙いを含めること
- 「いかがでしたか」「〜をご紹介します」などのAI臭い定型文は使わないこと
- 必ずJSON形式で返すこと

{
  "ideas": [
    {
      "title": "タイトル（キャッチーに・20文字以内）",
      "category": "カテゴリ名",
      "description": "内容の具体案と、その投稿で狙う効果（50文字以内）"
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
  const limit = PLAN_LIMITS[profile?.plan] ?? PLAN_LIMITS.free
  const remaining = profile?.plan === 'pro' ? null : limit - (profile?.ideas_count || 0) - 1
  return { ...result, remaining }
})
