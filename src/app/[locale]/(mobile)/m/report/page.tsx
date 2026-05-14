'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, CheckCircle, ChevronRight, ChevronLeft, X, ImageIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useIncidents } from '@/features/incidents/context'
import { useAuth } from '@/features/auth/context'
import { incidentSchema, type IncidentInput } from '@/lib/validations/incident'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type Severity = IncidentInput['severity']
type Category = IncidentInput['category']

const SEVERITIES: { value: Severity; emoji: string }[] = [
  { value: 'low',      emoji: '🟢' },
  { value: 'medium',   emoji: '🟡' },
  { value: 'high',     emoji: '🟠' },
  { value: 'critical', emoji: '🔴' },
]

const CATEGORIES: { value: Category; emoji: string }[] = [
  { value: 'equipment', emoji: '🔧' },
  { value: 'safety',    emoji: '⚠️'  },
  { value: 'hygiene',   emoji: '🧹' },
  { value: 'service',   emoji: '🍽️'  },
  { value: 'supply',    emoji: '📦' },
  { value: 'facility',  emoji: '🏗️'  },
  { value: 'other',     emoji: '📋' },
]

const TOTAL_STEPS = 3

export default function MobileReportPage() {
  const t      = useTranslations('mobile.report')
  const tCat   = useTranslations('incidents.category')
  const tSev   = useTranslations('incidents.severity')
  const locale = useLocale()
  const router = useRouter()
  const { createIncident } = useIncidents()
  const { user } = useAuth()

  const [step, setStep]         = useState(1)
  const [done, setDone]         = useState(false)
  const [newId, setNewId]       = useState<string | null>(null)
  const [severity, setSeverity] = useState<Severity>('medium')
  const [category, setCategory] = useState<Category>('other')
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<IncidentInput>({
    resolver: zodResolver(incidentSchema),
    defaultValues: { severity: 'medium', category: 'other' },
  })

  /* ── Navigation ─────────────────────────────────── */
  async function goNext() {
    if (step === 1) {
      const ok = await trigger('title')
      if (!ok) return
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  }

  // Tap severity → select + auto-advance to step 3
  function pickSeverity(value: Severity) {
    setSeverity(value)
    setTimeout(() => setStep(3), 200) // brief delay so the selection is visible
  }

  /* ── Photo handling ─────────────────────────────── */
  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  function clearPhoto() {
    setPhotoPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  /* ── Submit ─────────────────────────────────────── */
  async function handleSubmit() {
    const ok = await trigger('title')
    if (!ok) { setStep(1); return }

    const values = getValues()
    setIsSubmitting(true)
    try {
      const incident = await createIncident(
        {
          title: values.title,
          description: values.description,
          severity,
          category,
          photoUrl: photoPreview ?? undefined,
        },
        user?.organization?.id ?? 'org-1',
        user?.id ?? 'user-2',
      )
      setNewId(incident.id)
      setDone(true)
      toast.success(t('success'))
    } catch {
      toast.error('Error')
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ── Success screen ─────────────────────────────── */
  if (done) {
    return (
      <motion.div
        className="mobile-page mobile-page--centered"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="mobile-success">
          <CheckCircle className="mobile-success__icon" />
          <h2 className="mobile-success__title">{t('success')}</h2>
          <p className="mobile-success__desc">{t('successDesc')}</p>
          <div className="mobile-success__actions">
            <button
              type="button"
              className="mobile-btn mobile-btn--primary"
              onClick={() => router.push(`/${locale}/m/my-incidents/${newId}`)}
            >
              {t('viewReport')}
            </button>
            <button
              type="button"
              className="mobile-btn mobile-btn--ghost"
              onClick={() => { setDone(false); setStep(1); setPhotoPreview(null) }}
            >
              {t('reportAnother')}
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  /* ── Form ───────────────────────────────────────── */
  return (
    <div className="mobile-page">
      {/* Progress bar */}
      <div className="mobile-progress">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'mobile-progress__dot',
              i + 1 <= step && 'mobile-progress__dot--active',
            )}
          />
        ))}
      </div>

      {/* NOTE: no onSubmit on the form — prevents accidental submission on Enter */}
      <div className="mobile-form">
        <AnimatePresence mode="wait">

        {/* ── Step 1: What happened? ─────────────── */}
        {step === 1 && (
          <motion.div
            key="step-1"
            className="mobile-form__step"
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h2 className="mobile-form__step-title">{t('whatHappened')}</h2>

            <div className="mobile-form__field">
              <Input
                placeholder="e.g. Walk-in fridge above safe temp"
                className="mobile-input"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); goNext() } }}
                {...register('title')}
              />
              {errors.title && (
                <span className="mobile-form__error">{errors.title.message}</span>
              )}
            </div>

            <div className="mobile-form__field">
              <p className="mobile-form__label">Category</p>
              <div className="mobile-category-grid">
                {CATEGORIES.map(({ value, emoji }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setCategory(value)}
                    className={cn(
                      'mobile-category-btn',
                      category === value && 'mobile-category-btn--active',
                    )}
                  >
                    <span className="mobile-category-btn__emoji">{emoji}</span>
                    <span className="mobile-category-btn__label">{tCat(value)}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Step 2: Severity ──────────────────── */}
        {step === 2 && (
          <motion.div
            key="step-2"
            className="mobile-form__step"
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h2 className="mobile-form__step-title">{t('howSevere')}</h2>
            <p className="mobile-form__label" style={{ marginTop: '-0.5rem' }}>
              Tap to select — advances automatically
            </p>
            <div className="mobile-severity-list">
              {SEVERITIES.map(({ value, emoji }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => pickSeverity(value)}
                  className={cn(
                    'mobile-severity-btn',
                    severity === value && 'mobile-severity-btn--active',
                  )}
                >
                  <span className="mobile-severity-btn__emoji">{emoji}</span>
                  <span className="mobile-severity-btn__label">{tSev(value)}</span>
                  {severity === value && (
                    <CheckCircle className="mobile-severity-btn__check" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Step 3: Photo + Notes ─────────────── */}
        {step === 3 && (
          <motion.div
            key="step-3"
            className="mobile-form__step"
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h2 className="mobile-form__step-title">{t('addNotes')}</h2>

            {/* Real photo upload */}
            <div className="mobile-form__field">
              <p className="mobile-form__label">{t('addPhoto')}</p>

              {/* Hidden file input — accepts camera or gallery on mobile */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: 'none' }}
                onChange={handlePhotoChange}
              />

              {photoPreview ? (
                /* Preview with clear button */
                <div className="mobile-photo-preview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoPreview}
                    alt="Incident photo"
                    className="mobile-photo-preview__img"
                  />
                  <button
                    type="button"
                    className="mobile-photo-preview__clear"
                    onClick={clearPhoto}
                    aria-label="Remove photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Tap zone */
                <button
                  type="button"
                  className="mobile-photo-upload"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="mobile-photo-upload__icon" />
                  <p className="mobile-photo-upload__hint">{t('addPhotoHint')}</p>
                  <span className="mobile-photo-upload__alt">
                    <ImageIcon className="w-3.5 h-3.5" /> Gallery
                  </span>
                </button>
              )}
            </div>

            <div className="mobile-form__field">
              <Textarea
                placeholder={t('notesPlaceholder')}
                rows={4}
                className="mobile-textarea"
                {...register('description')}
              />
            </div>
          </motion.div>
        )}

        </AnimatePresence>

        {/* ── Navigation ───────────────────────── */}
        <div className="mobile-form__nav">
          {step > 1 && (
            <button
              type="button"
              className="mobile-btn mobile-btn--ghost"
              onClick={() => setStep((s) => s - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              className="mobile-btn mobile-btn--primary mobile-btn--full"
              onClick={goNext}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              className="mobile-btn mobile-btn--primary mobile-btn--full"
              onClick={handleSubmit}
            >
              {isSubmitting ? t('submitting') : t('submit')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
