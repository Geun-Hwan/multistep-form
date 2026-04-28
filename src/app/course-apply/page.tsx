import { Suspense } from 'react'
import CourseApplyForm from '@/features/course-apply/components/CourseApplyForm'

export const metadata = {
  title: '수강 신청 | 다단계 폼',
}

export default function CourseApplyPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <Suspense>
          <CourseApplyForm />
        </Suspense>
      </div>
    </main>
  )
}
