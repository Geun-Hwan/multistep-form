'use client'

import type { StepValue } from '../hooks/useStepNavigation'

interface Props {
  currentStep: StepValue
  maxReachedStep: StepValue
  onStepClick: (step: StepValue) => void
}

const STEPS = [
  { step: 1 as StepValue, label: '기본 정보' },
  { step: 2 as StepValue, label: '수강 정보' },
  { step: 3 as StepValue, label: '신청 확인' },
]

export default function StepIndicator({ currentStep, maxReachedStep, onStepClick }: Props) {
  return (
    <nav aria-label="신청 단계" className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map(({ step, label }, i) => {
        const isActive = currentStep === step
        const isCompleted = step < currentStep
        const isReachable = step <= maxReachedStep

        return (
          <div key={step} className="flex items-center">
            <button
              type="button"
              disabled={!isReachable}
              onClick={() => isReachable && onStepClick(step)}
              aria-current={isActive ? 'step' : undefined}
              className={[
                'flex flex-col items-center gap-1 px-2 group',
                isReachable ? 'cursor-pointer' : 'cursor-default',
              ].join(' ')}
            >
              <span
                className={[
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : isCompleted
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-200 text-gray-500',
                ].join(' ')}
              >
                {isCompleted ? '✓' : step}
              </span>
              <span
                className={[
                  'text-xs hidden sm:block',
                  isActive ? 'text-blue-600 font-medium' : 'text-gray-500',
                ].join(' ')}
              >
                {label}
              </span>
            </button>

            {i < STEPS.length - 1 && (
              <div
                className={[
                  'h-0.5 w-12 sm:w-20 mx-1',
                  step < currentStep ? 'bg-blue-400' : 'bg-gray-200',
                ].join(' ')}
              />
            )}
          </div>
        )
      })}
    </nav>
  )
}
