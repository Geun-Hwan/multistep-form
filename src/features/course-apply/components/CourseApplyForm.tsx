'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useSearchParams, useRouter } from 'next/navigation'

import type { FullFormValues, ApplicationSuccessResponse } from '../types'
import type { StepValue, StepParam } from '../hooks/useStepNavigation'
import { step1Schema } from '../schemas/step1Schema'
import { step2Schema } from '../schemas/step2Schema'
import { fullSchema } from '../schemas/fullSchema'
import { submitApplication } from '../api/courseApplication'
import { toApplicationDTO } from '../utils/toDTO'
import { saveFormState, loadFormState, clearFormState } from '../utils/stepStorage'

import StepIndicator from './StepIndicator'
import Step1BasicInfo from './Step1BasicInfo'
import Step2CourseInfo from './Step2CourseInfo'
import Step3Review from './Step3Review'
import Step4Complete from './Step4Complete'

const DEFAULT_VALUES: FullFormValues = {
  name: '',
  email: '',
  phone: '',
  ageGroup: '',
  courseId: '',
  courseGoal: '',
  otherGoal: '',
  hasExperience: '',
  previousCourse: '',
}

const STEP_TITLES: Record<number, string> = {
  1: 'Step 1. 기본 정보',
  2: 'Step 2. 수강 정보',
  3: 'Step 3. 신청 확인',
}

const STEP_SCHEMAS = {
  1: step1Schema,
  2: step2Schema,
} as const

export default function CourseApplyForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [restoredState] = useState(() => (typeof window === 'undefined' ? null : loadFormState()))
  const [maxReachedStep, setMaxReachedStep] = useState<StepValue>(restoredState?.maxStep ?? 1)
  const [submitResult, setSubmitResult] = useState<ApplicationSuccessResponse | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)

  const rawStep = searchParams.get('step')
  const mockMode = searchParams.get('mock')
  const isComplete = rawStep === 'complete'
  const currentStep = parseStep(rawStep, maxReachedStep)

  const methods = useForm<FullFormValues>({
    defaultValues: restoredState?.values ?? DEFAULT_VALUES,
    mode: 'onSubmit',
  })

  const syncedRef = useRef(false)
  useEffect(() => {
    if (syncedRef.current) return
    syncedRef.current = true

    if (isComplete && !submitResult) {
      clearFormState()
      router.replace('/course-apply?step=1')
      window.requestAnimationFrame(() => setIsReady(true))
      return
    }

    const normalizedStep = normalizeStep(rawStep, maxReachedStep)
    if (normalizedStep && normalizedStep !== rawStep) {
      router.replace(buildStepUrl(normalizedStep, mockMode))
    }

    window.requestAnimationFrame(() => setIsReady(true))
  }, [isComplete, maxReachedStep, mockMode, rawStep, router, submitResult])

  const mutation = useMutation({
    mutationFn: (values: FullFormValues) => submitApplication(toApplicationDTO(values), mockMode),
    onSuccess: (data) => {
      setSubmitResult(data)
      router.push(buildStepUrl('complete', mockMode))
    },
    onError: (err: Error) => {
      setSubmitError(err.message)
    },
  })

  const goToStep = (step: StepValue | 'complete') => {
    router.push(buildStepUrl(String(step) as StepParam, mockMode))
  }

  const handleNext = async () => {
    const values = methods.getValues()
    const schema = STEP_SCHEMAS[currentStep as keyof typeof STEP_SCHEMAS]

    if (schema) {
      const result = schema.safeParse(values)
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof FullFormValues
          methods.setError(field, { type: 'manual', message: issue.message })
        })
        return
      }
      methods.clearErrors()
    }

    const next = (currentStep + 1) as StepValue
    const newMax = next > maxReachedStep ? next : maxReachedStep
    if (next > maxReachedStep) setMaxReachedStep(next)
    saveFormState(methods.getValues(), newMax)
    goToStep(next)
  }

  const handlePrev = () => {
    if (currentStep > 1) goToStep((currentStep - 1) as StepValue)
  }

  const handleSubmit = async () => {
    const values = methods.getValues()
    const result = fullSchema.safeParse(values)

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FullFormValues
        methods.setError(field, { type: 'manual', message: issue.message })
      })
      const firstErrorField = result.error.issues[0]?.path[0] as string
      const step1Fields = ['name', 'email', 'phone', 'ageGroup']
      goToStep(step1Fields.includes(firstErrorField) ? 1 : 2)
      return
    }

    setSubmitError(null)
    mutation.mutate(values)
  }

  const handleReset = () => {
    methods.reset(DEFAULT_VALUES)
    setSubmitResult(null)
    setSubmitError(null)
    setMaxReachedStep(1)
    clearFormState()
    router.push(buildStepUrl('1', mockMode))
  }

  if (!isReady && !isComplete) {
    return <div className="card h-64 animate-pulse bg-white" />
  }

  if (isComplete && submitResult) {
    return (
      <div className="card">
        <Step4Complete result={submitResult} onReset={handleReset} />
      </div>
    )
  }

  return (
    <FormProvider {...methods}>
      <div className="card pb-28 sm:pb-8">
        <StepIndicator
          currentStep={currentStep}
          maxReachedStep={maxReachedStep}
          onStepClick={(step) => goToStep(step)}
        />

        <h1 className="mb-6 text-lg font-semibold text-gray-900">{STEP_TITLES[currentStep]}</h1>

        <div>
          {currentStep === 1 && <Step1BasicInfo />}
          {currentStep === 2 && <Step2CourseInfo mockMode={mockMode} />}
          {currentStep === 3 && <Step3Review mockMode={mockMode} />}

          {submitError && (
            <p role="alert" className="mt-4 text-center text-sm text-red-500">
              {submitError}
            </p>
          )}

          <div className="fixed inset-x-0 bottom-0 z-10 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur sm:static sm:mt-8 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
            <div className="mx-auto flex w-full max-w-lg gap-3 sm:justify-end">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="btn-secondary flex-1 sm:flex-none"
                >
                  이전
                </button>
              )}
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary flex-1 sm:flex-none"
                >
                  다음
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={mutation.isPending}
                  className="btn-primary flex-1 sm:flex-none disabled:opacity-50"
                >
                  {mutation.isPending ? '제출 중...' : '신청 완료'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  )
}

function parseStep(raw: string | null, maxReached: StepValue): StepValue {
  const normalized = normalizeStep(raw, maxReached)
  return Number(normalized ?? '1') as StepValue
}

function normalizeStep(raw: string | null, maxReached: StepValue): Extract<StepParam, '1' | '2' | '3'> | null {
  const n = Number(raw)
  if (!Number.isInteger(n) || n < 1 || n > 3) return '1'
  if (n > maxReached) return String(maxReached) as Extract<StepParam, '1' | '2' | '3'>
  return String(n) as Extract<StepParam, '1' | '2' | '3'>
}

function buildStepUrl(step: StepParam, mockMode: string | null): string {
  const params = new URLSearchParams({ step })
  if (mockMode) {
    params.set('mock', mockMode)
  }
  return `/course-apply?${params.toString()}`
}
