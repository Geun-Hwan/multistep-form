'use client'

import { useFormContext, useWatch } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import type { FullFormValues } from '../types'
import { fetchCourses } from '../api/courses'
import FormField from './FormField'

const COURSE_GOALS = ['취업', '이직', '자기계발', '기타'] as const

export default function Step2CourseInfo() {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext<FullFormValues>()

  const courseGoal = useWatch<FullFormValues, 'courseGoal'>({ name: 'courseGoal' })
  const hasExperience = useWatch<FullFormValues, 'hasExperience'>({ name: 'hasExperience' })

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  })

  const handleCourseGoalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as FullFormValues['courseGoal']
    setValue('courseGoal', value, { shouldValidate: true })
    if (value !== '기타') {
      setValue('otherGoal', '', { shouldValidate: false })
    }
  }

  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as FullFormValues['hasExperience']
    setValue('hasExperience', value, { shouldValidate: true })
    if (value !== '있음') {
      setValue('previousCourse', '', { shouldValidate: false })
    }
  }

  return (
    <div className="space-y-5">
      <FormField label="희망 강의" error={errors.courseId?.message} required>
        {isLoading && (
          <div className="input flex items-center text-gray-400 text-sm">강의 목록 로딩 중...</div>
        )}
        {isError && (
          <div className="space-y-2">
            <p className="text-sm text-red-500">강의 목록을 불러오지 못했습니다.</p>
            <button type="button" onClick={() => refetch()} className="btn-secondary text-sm">
              다시 시도
            </button>
          </div>
        )}
        {data && (
          <select {...register('courseId')} id="courseId" className="input">
            <option value="">선택해주세요.</option>
            {data.courses.map((course) => {
              const isClosed = course.remainingSeats === 0
              return (
                <option key={course.id} value={course.id} disabled={isClosed}>
                  {course.title}
                  {isClosed ? ' (마감)' : ` (잔여 ${course.remainingSeats}석)`}
                </option>
              )
            })}
          </select>
        )}
      </FormField>

      <FormField label="수강 목적" error={errors.courseGoal?.message} required>
        <select
          {...register('courseGoal')}
          id="courseGoal"
          className="input"
          onChange={handleCourseGoalChange}
        >
          <option value="">선택해주세요.</option>
          {COURSE_GOALS.map((goal) => (
            <option key={goal} value={goal}>
              {goal}
            </option>
          ))}
        </select>
      </FormField>

      {courseGoal === '기타' && (
        <FormField label="기타 수강 목적" error={errors.otherGoal?.message} required>
          <input
            {...register('otherGoal')}
            id="otherGoal"
            type="text"
            placeholder="수강 목적을 직접 입력해주세요."
            className="input"
          />
        </FormField>
      )}

      <FormField label="수강 경험" error={errors.hasExperience?.message} required>
        <div className="flex gap-6" role="group" aria-labelledby="hasExperience-label">
          {(['있음', '없음'] as const).map((val) => (
            <label key={val} className="flex items-center gap-2 cursor-pointer">
              <input
                {...register('hasExperience')}
                type="radio"
                value={val}
                onChange={handleExperienceChange}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-sm text-gray-700">{val}</span>
            </label>
          ))}
        </div>
      </FormField>

      {hasExperience === '있음' && (
        <FormField label="기존 수강 강의명" error={errors.previousCourse?.message} required>
          <input
            {...register('previousCourse')}
            id="previousCourse"
            type="text"
            placeholder="이전에 수강한 강의명을 입력해주세요."
            className="input"
          />
        </FormField>
      )}
    </div>
  )
}
