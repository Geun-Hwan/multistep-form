import type { ApplicationRequest, ApplicationSuccessResponse } from '../types'

export async function submitApplication(
  data: ApplicationRequest,
): Promise<ApplicationSuccessResponse> {
  const res = await fetch('/api/course-applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message ?? '신청 처리 중 오류가 발생했습니다.')
  return json
}
