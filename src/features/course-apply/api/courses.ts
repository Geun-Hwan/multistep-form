import type { CoursesResponse } from '../types'

export async function fetchCourses(mockMode?: string | null): Promise<CoursesResponse> {
  const res = await fetch('/api/courses', {
    headers: mockMode ? { 'x-mock-mode': mockMode } : undefined,
  })

  if (!res.ok) throw new Error('강의 목록을 불러오지 못했습니다.')
  return res.json()
}
