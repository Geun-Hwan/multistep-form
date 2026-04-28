import type { CoursesResponse } from '../types'

export async function fetchCourses(): Promise<CoursesResponse> {
  const res = await fetch('/api/courses')
  if (!res.ok) throw new Error('강의 목록을 불러오지 못했습니다.')
  return res.json()
}
