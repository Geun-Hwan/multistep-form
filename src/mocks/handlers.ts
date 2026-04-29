import { http, HttpResponse } from 'msw'
import coursesData from '../../docs/mock-data/courses.json'
import successData from '../../docs/mock-data/application-success.json'
import errorData from '../../docs/mock-data/application-error.json'

export const handlers = [
  http.get('/api/courses', ({ request }) => {
    if (request.headers.get('x-mock-mode') === 'courses-error') {
      return HttpResponse.json({ message: '강의 목록을 불러오지 못했습니다.' }, { status: 500 })
    }

    return HttpResponse.json(coursesData)
  }),

  http.post('/api/course-applications', async ({ request }) => {
    const mockMode = request.headers.get('x-mock-mode')
    const body = (await request.json()) as { courseId?: string }
    const selectedCourse = coursesData.courses.find((course) => course.id === body.courseId)

    if (mockMode === 'submit-error') {
      return HttpResponse.json(errorData, { status: 500 })
    }

    if (selectedCourse && selectedCourse.remainingSeats === 0) {
      return HttpResponse.json(
        {
          message: '마감된 강의는 신청할 수 없습니다.',
          code: 'COURSE_ALREADY_CLOSED',
        },
        { status: 409 },
      )
    }

    return HttpResponse.json(successData, { status: 201 })
  }),
]
