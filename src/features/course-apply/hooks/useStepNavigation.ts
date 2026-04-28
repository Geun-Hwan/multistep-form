'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export type StepValue = 1 | 2 | 3
export type StepParam = '1' | '2' | '3' | 'complete'

const MAX_STEP: StepValue = 3

export function useStepNavigation(maxReachedStep: StepValue) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const rawStep = searchParams.get('step')
  const currentStep = parseStep(rawStep, maxReachedStep)

  const goTo = useCallback(
    (step: StepParam) => {
      router.push(`/course-apply?step=${step}`)
    },
    [router],
  )

  const goNext = useCallback(() => {
    if (currentStep < MAX_STEP) {
      goTo(String(currentStep + 1) as StepParam)
    }
  }, [currentStep, goTo])

  const goPrev = useCallback(() => {
    if (currentStep > 1) {
      goTo(String(currentStep - 1) as StepParam)
    }
  }, [currentStep, goTo])

  const goComplete = useCallback(() => goTo('complete'), [goTo])

  return { currentStep, goNext, goPrev, goComplete, goTo }
}

function parseStep(raw: string | null, maxReached: StepValue): StepValue {
  const n = Number(raw)
  if (!Number.isInteger(n) || n < 1 || n > MAX_STEP) return 1
  if (n > maxReached) return maxReached
  return n as StepValue
}
