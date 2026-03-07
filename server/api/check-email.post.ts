import disposableDomains from 'disposable-email-domains'

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event)
  if (!email) throw createError({ statusCode: 400, message: 'メールアドレスが必要です' })

  const domain = email.split('@')[1]?.toLowerCase()
  const isDisposable = disposableDomains.includes(domain)

  return { isDisposable }
})
