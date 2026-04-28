export type AgeGroup = '10대' | '20대' | '30대' | '40대' | '50대 이상'
export type CourseGoal = '취업' | '이직' | '자기계발' | '기타'
export type HasExperience = '있음' | '없음'

export interface Step1FormValues {
  name: string
  email: string
  phone: string
  ageGroup: AgeGroup | ''
}

export interface Step2FormValues {
  courseId: string
  courseGoal: CourseGoal | ''
  otherGoal: string
  hasExperience: HasExperience | ''
  previousCourse: string
}

export type FullFormValues = Step1FormValues & Step2FormValues

export interface Course {
  id: string
  title: string
  description: string
  category: string
  capacity: number
  remainingSeats: number
}

export interface CoursesResponse {
  courses: Course[]
}

export interface ApplicationSuccessResponse {
  applicationId: string
  submittedAt: string
  message: string
}

export interface ApplicationErrorResponse {
  message: string
  code: string
}

export interface ApplicationRequest {
  name: string
  email: string
  phone: string
  ageGroup: string
  courseId: string
  courseGoal: string
  otherGoal?: string
  hasExperience: string
  previousCourse?: string
}
