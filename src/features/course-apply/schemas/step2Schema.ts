import { z } from 'zod'

export const step2Schema = z
  .object({
    courseId: z.string().min(1, '수강할 강의를 선택해주세요.'),
    courseGoal: z.enum(['취업', '이직', '자기계발', '기타'], {
      error: '수강 목적을 선택해주세요.',
    }),
    otherGoal: z.string(),
    hasExperience: z.enum(['있음', '없음'], {
      error: '수강 경험 여부를 선택해주세요.',
    }),
    previousCourse: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.courseGoal === '기타' && !data.otherGoal.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '기타 수강 목적을 입력해주세요.',
        path: ['otherGoal'],
      })
    }
    if (data.hasExperience === '있음' && !data.previousCourse.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '기존 수강 강의명을 입력해주세요.',
        path: ['previousCourse'],
      })
    }
  })

export type Step2Values = z.infer<typeof step2Schema>
