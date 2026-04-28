import { http, HttpResponse } from 'msw'
import coursesData from '../../docs/mock-data/courses.json'
import successData from '../../docs/mock-data/application-success.json'

export const handlers = [
  http.get('/api/courses', () => {
    return HttpResponse.json(coursesData)
  }),

  http.post('/api/course-applications', () => {
    return HttpResponse.json(successData, { status: 201 })
  }),
]
