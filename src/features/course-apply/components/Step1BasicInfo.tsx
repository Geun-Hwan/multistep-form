'use client'

import { useFormContext, useController } from 'react-hook-form'
import type { FullFormValues } from '../types'
import FormField from './FormField'
import EmailInput from './EmailInput'
import PhoneInput from './PhoneInput'

const AGE_GROUPS = ['10대', '20대', '30대', '40대', '50대 이상'] as const

export default function Step1BasicInfo() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<FullFormValues>()

  const { field: emailField } = useController<FullFormValues, 'email'>({ name: 'email', control })
  const { field: phoneField } = useController<FullFormValues, 'phone'>({ name: 'phone', control })

  return (
    <div className="space-y-5">
      <FormField label="이름" error={errors.name?.message} required id="name">
        <input
          {...register('name')}
          id="name"
          type="text"
          placeholder="이름을 입력해주세요."
          className="input"
        />
      </FormField>

      <FormField label="이메일" error={errors.email?.message} required id="email">
        <EmailInput
          value={emailField.value}
          onChange={emailField.onChange}
          onBlur={emailField.onBlur}
        />
      </FormField>

      <FormField label="전화번호" error={errors.phone?.message} required id="phone">
        <PhoneInput
          value={phoneField.value}
          onChange={phoneField.onChange}
          onBlur={phoneField.onBlur}
        />
      </FormField>

      <FormField label="나이대" error={errors.ageGroup?.message} required id="ageGroup">
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
