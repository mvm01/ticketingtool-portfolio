'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useIncidents } from '@/features/incidents/context'
import { useAuth } from '@/features/auth/context'
import { incidentSchema, type IncidentInput } from '@/lib/validations/incident'
import { toast } from 'sonner'

const CATEGORIES = ['equipment', 'safety', 'hygiene', 'service', 'supply', 'facility', 'other'] as const
const SEVERITIES = ['low', 'medium', 'high', 'critical'] as const

export default function NewIncidentPage() {
  const t = useTranslations('incidents')
  const tFields = useTranslations('incidents.fields')
  const tSev = useTranslations('incidents.severity')
  const tCat = useTranslations('incidents.category')
  const tCommon = useTranslations('common')
  const tToast = useTranslations('toast')
  const locale = useLocale()
  const router = useRouter()
  const { createIncident } = useIncidents()
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IncidentInput>({
    resolver: zodResolver(incidentSchema),
    defaultValues: { category: 'other', severity: 'medium' },
  })

  async function onSubmit(data: IncidentInput) {
    try {
      await createIncident(data, user?.organization?.id ?? 'org-1', user?.id ?? 'user-1')
      toast.success(tToast('incidentCreated'))
      router.push(`/${locale}/incidents`)
    } catch {
      toast.error(tToast('error'))
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-header__title">{t('report')}</h1>
      </div>

      <div style={{ maxWidth: 600 }}>
        <form className="incident-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="incident-form__field">
            <label className="incident-form__label">{tFields('title')}</label>
            <Input placeholder={tFields('titlePlaceholder')} {...register('title')} />
            {errors.title && (
              <span className="incident-form__error">{errors.title.message}</span>
            )}
          </div>

          <div className="incident-form__field">
            <label className="incident-form__label">{tFields('description')}</label>
            <Textarea
              placeholder={tFields('descriptionPlaceholder')}
              rows={3}
              {...register('description')}
            />
          </div>

          <div className="incident-form__row">
            <div className="incident-form__field">
              <label className="incident-form__label">{tFields('category')}</label>
              <Select
                defaultValue="other"
                onValueChange={(v) => setValue('category', v as IncidentInput['category'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {tCat(c)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="incident-form__field">
              <label className="incident-form__label">{tFields('severity')}</label>
              <Select
                defaultValue="medium"
                onValueChange={(v) => setValue('severity', v as IncidentInput['severity'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SEVERITIES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {tSev(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? tCommon('submitting') : t('report')}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
            >
              {tCommon('cancel')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
