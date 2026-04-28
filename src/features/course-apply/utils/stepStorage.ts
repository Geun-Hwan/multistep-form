import type { StepValue } from '../hooks/useStepNavigation'
import type { FullFormValues } from '../types'

const STEP_KEY = 'course-apply-max-step'
const FORM_KEY = 'course-apply-form-values'

export function saveFormState(values: FullFormValues, maxStep: StepValue): void {
  try {
    sessionStorage.setItem(STEP_KEY, String(maxStep))
    sessionStorage.setItem(FORM_KEY, JSON.stringify(values))
  } catch {}
}

export function loadFormState(): { values: FullFormValues; maxStep: StepValue } | null {
  try {
    const stepRaw = sessionStorage.getItem(STEP_KEY)
    const valuesRaw = sessionStorage.getItem(FORM_KEY)
    if (!stepRaw || !valuesRaw) return null

    const maxStep = Number(stepRaw)
    if (!Number.isInteger(maxStep) || maxStep < 1 || maxStep > 3) return null

    return { values: JSON.parse(valuesRaw) as FullFormValues, maxStep: maxStep as StepValue }
  } catch {
    return null
  }
}

export function clearFormState(): void {
  try {
    sessionStorage.removeItem(STEP_KEY)
    sessionStorage.removeItem(FORM_KEY)
  } catch {}
}
