import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const categoryLabels: Record<string, string> = {
  bug: '不具合・エラー報告',
  feature: '機能のご要望',
  billing: '料金・決済について',
  other: 'その他'
}

export default defineEventHandler(async (event) => {
  const { name, email, category, message } = await readBody(event)

  if (!name || !email || !category || !message) {
    throw createError({ statusCode: 400, message: '必須項目が不足しています' })
  }

  await resend.emails.send({
    from: 'SNS Post Calendar <onboarding@resend.dev>',
    to: 'maveri_90@icloud.com',
    subject: `【お問い合わせ】${categoryLabels[category] ?? category}`,
    text: `お名前: ${name}\nメール: ${email}\n種別: ${categoryLabels[category] ?? category}\n\n${message}`
  })

  return { ok: true }
})
