import type { StepValue } from '../hooks/useStepNavigation'

const KEY = 'course-apply-max-step'

export function saveMaxStep(step: StepValue): void {
  try {
    sessionStorage.setItem(KEY, String(step))
  } catch {}
}

export function loadMaxStep(): StepValue {
  try {
    const raw = sessionStorage.getItem(KEY)
    const n = Number(raw)
    if (Number.isInteger(n) && n >= 1 && n <= 3) return n as StepValue
  } catch {}
  return 1
}

export function clearMaxStep(): void {
  try {
    sessionStorage.removeItem(KEY)
  } catch {}
}
