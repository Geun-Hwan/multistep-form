import type { FullFormValues, ApplicationRequest } from '../types'

export function toApplicationDTO(values: FullFormValues): ApplicationRequest {
  const dto: ApplicationRequest = {
    name: values.name,
    email: values.email,
    phone: values.phone,
    ageGroup: values.ageGroup,
    courseId: values.courseId,
    courseGoal: values.courseGoal,
    hasExperience: values.hasExperience,
  }

  if (values.courseGoal === '기타' && values.otherGoal) {
    dto.otherGoal = values.otherGoal
  }

  if (values.hasExperience === '있음' && values.previousCourse) {
    dto.previousCourse = values.previousCourse
  }

  return dto
}
