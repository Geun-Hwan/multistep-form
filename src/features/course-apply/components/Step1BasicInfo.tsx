'use client'

import { useFormContext } from 'react-hook-form'
import type { FullFormValues } from '../types'
import FormField from './FormField'

const AGE_GROUPS = ['10대', '20대', '30대', '40대', '50대 이상'] as const

export default function Step1BasicInfo() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FullFormValues>()

  return (
    <div className="space-y-5">
      <FormField label="이름" error={errors.name?.message} required>
        <input
          {...register('name')}
          id="name"
          type="text"
          placeholder="이름을 입력해주세요."
          className="input"
        />
      </FormField>

      <FormField label="이메일" error={errors.email?.message} required>
        <input
          {...register('email')}
          id="email"
          type="email"
          placeholder="example@email.com"
          className="input"
        />
      </FormField>

      <FormField label="전화번호" error={errors.phone?.message} required>
        <input
          {...register('phone')}
          id="phone"
          type="tel"
          inputMode="numeric"
          placeholder="숫자만 입력해주세요. (예: 01012345678)"
          className="input"
        />
      </FormField>

      <FormField label="나이대" error={errors.ageGroup?.message} required>
        <select {...register('ageGroup')} id="ageGroup" className="input">
          <option value="">선택해주세요.</option>
          {AGE_GROUPS.map((age) => (
            <option key={age} value={age}>
              {age}
            </option>
          ))}
        </select>
      </FormField>
    </div>
  )
}
