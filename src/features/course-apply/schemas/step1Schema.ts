import { z } from 'zod'

export const step1Schema = z.object({
  name: z.string().min(2, '이름은 2자 이상이어야 합니다.'),
  email: z.string().email('올바른 이메일 형식이 아닙니다.'),
  phone: z.string().regex(/^\d{10,11}$/, '전화번호는 숫자 10~11자리여야 합니다.'),
  ageGroup: z.enum(['10대', '20대', '30대', '40대', '50대 이상'], {
    error: '나이대를 선택해주세요.',
  }),
})

export type Step1Values = z.infer<typeof step1Schema>
