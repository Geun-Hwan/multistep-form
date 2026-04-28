'use client'

import { useFormContext } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import type { FullFormValues } from '../types'
import { fetchCourses } from '../api/courses'

interface ReviewRowProps {
  label: string
  value: string
}

function ReviewRow({ label, value }: ReviewRowProps) {
  return (
    <div className="flex gap-4 py-3 border-b border-gray-100 last:border-0">
      <dt className="w-32 shrink-0 text-sm text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900 font-medium break-all">{value}</dd>
    </div>
  )
}

export default function Step3Review() {
  const { getValues } = useFormContext<FullFormValues>()
  const values = getValues()

  const { data } = useQuery({ queryKey: ['courses'], queryFn: fetchCourses })
  const courseTitle = data?.courses.find((c) => c.id === values.courseId)?.title ?? values.courseId

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">입력하신 내용을 확인해주세요.</p>
      <dl className="bg-gray-50 rounded-xl px-4 divide-y divide-gray-100">
        <ReviewRow label="이름" value={values.name} />
        <ReviewRow label="이메일" value={values.email} />
        <ReviewRow label="전화번호" value={values.phone} />
        <ReviewRow label="나이대" value={values.ageGroup} />
        <ReviewRow label="희망 강의" value={courseTitle} />
        <ReviewRow label="수강 목적" value={values.courseGoal} />
        {values.courseGoal === '기타' && values.otherGoal && (
          <ReviewRow label="기타 수강 목적" value={values.otherGoal} />
        )}
        <ReviewRow label="수강 경험" value={values.hasExperience} />
        {values.hasExperience === '있음' && values.previousCourse && (
          <ReviewRow label="기존 수강 강의명" value={values.previousCourse} />
        )}
      </dl>
    </div>
  )
}
