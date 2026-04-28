'use client'

import { useFormContext, useController } from 'react-hook-form'
import type { FullFormValues } from '../types'
import FormField from './FormField'

const AGE_GROUPS = ['10대', '20대', '30대', '40대', '50대 이상'] as const

function formatPhone(digits: string): string {
  if (!digits) return ''
  if (digits.startsWith('02')) {
    if (digits.length <= 2) return digits
    if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`
    if (digits.length <= 9) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  if (digits.length <= 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

export default function Step1BasicInfo() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<FullFormValues>()

  const { field: phoneField } = useController<FullFormValues, 'phone'>({
    name: 'phone',
    control,
  })

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 11)
    phoneField.onChange(raw)
  }

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End',
    ]
    if (allowedKeys.includes(e.key)) return
    if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x', 'z'].includes(e.key.toLowerCase())) return
    if (!/^\d$/.test(e.key)) e.preventDefault()
  }

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
          id="phone"
          type="tel"
          inputMode="numeric"
          placeholder="010-0000-0000"
          className="input"
          value={formatPhone(phoneField.value)}
          onChange={handlePhoneChange}
          onKeyDown={handlePhoneKeyDown}
          onBlur={phoneField.onBlur}
          ref={phoneField.ref}
          name={phoneField.name}
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
