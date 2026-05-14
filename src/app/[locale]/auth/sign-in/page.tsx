'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/features/auth/context'
import { signInSchema, type SignInInput } from '@/lib/validations/auth'
import { toast } from 'sonner'

export default function SignInPage() {
  const t = useTranslations('auth')
  const tVal = useTranslations('validation')
  const tToast = useTranslations('toast')
  const tCommon = useTranslations('common')
  const locale = useLocale()
  const router = useRouter()
  const { signIn } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  })

  async function onSubmit(data: SignInInput) {
    try {
      await signIn(data.email, data.password)
      toast.success(tToast('signInSuccess'))
      router.push(`/${locale}/dashboard`)
    } catch {
      toast.error(tToast('error'))
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__brand">
          <Zap className="auth-card__brand-icon" />
          <span className="auth-card__brand-name">RestaurantOps</span>
        </div>

        <div className="auth-card__header">
          <h1 className="auth-card__title">{t('welcomeBack')}</h1>
          <p className="auth-card__subtitle">{t('signingIn')}</p>
        </div>

        <form className="auth-card__form" onSubmit={handleSubmit(onSubmit)}>
          <div className="auth-card__field">
            <label className="auth-card__label">{t('email')}</label>
            <Input
              type="email"
              placeholder={t('emailPlaceholder')}
              autoComplete="email"
              {...register('email')}
            />
            {errors.email && (
              <span className="auth-card__error">{tVal('emailInvalid')}</span>
            )}
          </div>

          <div className="auth-card__field">
            <label className="auth-card__label">{t('password')}</label>
            <Input
              type="password"
              placeholder={t('passwordPlaceholder')}
              autoComplete="current-password"
              {...register('password')}
            />
            {errors.password && (
              <span className="auth-card__error">{tVal('passwordMin')}</span>
            )}
          </div>

          <Button type="submit" className="w-full mt-1" disabled={isSubmitting}>
            {isSubmitting ? tCommon('submitting') : t('signIn')}
          </Button>
        </form>

        <p className="auth-card__footer">
          {t('noAccount')}{' '}
          <Link href={`/${locale}/auth/sign-up`} className="auth-card__link">
            {t('signUp')}
          </Link>
        </p>
      </div>
    </div>
  )
}
