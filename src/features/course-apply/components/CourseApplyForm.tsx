'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useSearchParams, useRouter } from 'next/navigation'

import type { FullFormValues, ApplicationSuccessResponse } from '../types'
import type { StepValue } from '../hooks/useStepNavigation'
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
  const [maxReachedStep, setMaxReachedStep] = useState<StepValue>(1)
  const [submitResult, setSubmitResult] = useState<ApplicationSuccessResponse | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)

  const rawStep = searchParams.get('step')
  const isComplete = rawStep === 'complete'
  const currentStep = parseStep(rawStep, maxReachedStep)

  const methods = useForm<FullFormValues>({
    defaultValues: DEFAULT_VALUES,
    mode: 'onSubmit',
  })

  // 마운트 시 sessionStorage에서 최대 도달 스텝 복원 + URL 보정
  const syncedRef = useRef(false)
  useEffect(() => {
    if (syncedRef.current) return
    syncedRef.current = true

    // complete 화면 새로고침 시 결과 없으면 초기화 후 step=1 이동
    if (isComplete && !submitResult) {
      clearFormState()
      router.replace('/course-apply?step=1')
      setIsReady(true)
      return
    }

    // sessionStorage에서 폼 값 + 최대 스텝 복원
    const stored = loadFormState()
    if (stored) {
      methods.reset(stored.values)
      setMaxReachedStep(stored.maxStep)

      // URL 스텝이 복원된 최대 스텝보다 앞서면 보정
      const urlStep = Number(rawStep)
      if (!isNaN(urlStep) && urlStep > stored.maxStep) {
        router.replace(`/course-apply?step=${stored.maxStep}`)
      }
    }

    setIsReady(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const mutation = useMutation({
    mutationFn: (values: FullFormValues) => submitApplication(toApplicationDTO(values)),
    onSuccess: (data) => {
      setSubmitResult(data)
      router.push('/course-apply?step=complete')
    },
    onError: (err: Error) => {
      setSubmitError(err.message)
    },
  })

  const goToStep = (step: StepValue | 'complete') => {
    router.push(`/course-apply?step=${step}`)
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
    saveFormState(methods.getValues(), newMax) // 검증 통과한 값 + 스텝 저장
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
    clearFormState() // sessionStorage 초기화
    router.push('/course-apply?step=1')
  }

  // hydration 완료 전 렌더 방지 (스텝 flash 방지)
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
      <div className="card">
        <StepIndicator
          currentStep={currentStep}
          maxReachedStep={maxReachedStep}
          onStepClick={(step) => goToStep(step)}
        />

        <h1 className="text-lg font-semibold text-gray-900 mb-6">{STEP_TITLES[currentStep]}</h1>

        <div>
          {currentStep === 1 && <Step1BasicInfo />}
          {currentStep === 2 && <Step2CourseInfo />}
          {currentStep === 3 && <Step3Review />}

          {submitError && (
            <p role="alert" className="mt-4 text-sm text-red-500 text-center">
              {submitError}
            </p>
          )}

          <div className="mt-8 flex gap-3 sm:justify-end">
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
    </FormProvider>
  )
}

function parseStep(raw: string | null, maxReached: StepValue): StepValue {
  const n = Number(raw)
  if (!Number.isInteger(n) || n < 1 || n > 3) return 1
  if (n > maxReached) return maxReached
  return n as StepValue
}
