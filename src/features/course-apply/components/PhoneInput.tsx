'use client'

import { useEffect, useRef, useState } from 'react'

function splitPhone(digits: string): [string, string, string] {
  if (!digits) return ['', '', '']
  // 02로 시작하는 서울 번호: 2-4-4 분할
  if (digits.startsWith('02')) {
    const area = '02'
    const rest = digits.slice(2)
    if (rest.length <= 4) return [area, rest, '']
    const last = rest.slice(-4)
    const middle = rest.slice(0, rest.length - 4)
    return [area, middle, last]
  }
  // 10자리: 3-3-4, 11자리: 3-4-4
  if (digits.length <= 3) return [digits, '', '']
  if (digits.length <= 6) return [digits.slice(0, 3), digits.slice(3), '']
  const area = digits.slice(0, 3)
  const last = digits.slice(-4)
  const middle = digits.slice(3, digits.length - 4)
  return [area, middle, last]
}

const PREVENT_KEYS = [
  'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
  'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End',
]

function preventNonDigit(e: React.KeyboardEvent<HTMLInputElement>) {
  if (PREVENT_KEYS.includes(e.key)) return
  if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x', 'z'].includes(e.key.toLowerCase())) return
  if (!/^\d$/.test(e.key)) e.preventDefault()
}

interface Props {
  value: string // raw digits (e.g. "01012345678")
  onChange: (digits: string) => void
  onBlur: () => void
}

export default function PhoneInput({ value, onChange, onBlur }: Props) {
  const [area, setArea] = useState(() => splitPhone(value)[0])
  const [middle, setMiddle] = useState(() => splitPhone(value)[1])
  const [last, setLast] = useState(() => splitPhone(value)[2])
  const internalRef = useRef(false)

  const ref1 = useRef<HTMLInputElement>(null)
  const ref2 = useRef<HTMLInputElement>(null)
  const ref3 = useRef<HTMLInputElement>(null)

  // sessionStorage 복원 등 외부 value 변경 시 동기화
  useEffect(() => {
    if (internalRef.current) {
      internalRef.current = false
      return
    }
    const [a, m, l] = splitPhone(value)
    setArea(a)
    setMiddle(m)
    setLast(l)
  }, [value])

  const emit = (a: string, m: string, l: string) => {
    internalRef.current = true
    onChange(a + m + l)
  }

  const handleAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    // 02는 2자리에서 자동 이동, 나머지는 3자리
    const isSeoul = raw.startsWith('02')
    const maxLen = isSeoul && raw.length >= 2 ? 2 : 3
    const v = raw.slice(0, maxLen)
    setArea(v)
    emit(v, middle, last)
    if (v.length === maxLen) ref2.current?.focus()
  }

  const handleMiddleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, '').slice(0, 4)
    setMiddle(v)
    emit(area, v, last)
    if (v.length === 4) ref3.current?.focus()
  }

  const handleLastChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, '').slice(0, 4)
    setLast(v)
    emit(area, middle, v)
  }

  const handleBackspace = (
    part: 2 | 3,
    currentVal: string,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace' && currentVal === '') {
      e.preventDefault()
      if (part === 2) ref1.current?.focus()
      if (part === 3) ref2.current?.focus()
    }
  }

  const inputBase = 'input text-center tracking-widest'

  return (
    <div className="flex items-center gap-2">
      <input
        ref={ref1}
        id="phone"
        type="tel"
        inputMode="numeric"
        maxLength={3}
        placeholder="010"
        value={area}
        onChange={handleAreaChange}
        onKeyDown={(e) => { preventNonDigit(e) }}
        onBlur={onBlur}
        className={`${inputBase} w-20 shrink-0`}
      />
      <span className="text-gray-300 shrink-0 text-lg font-light">—</span>
      <input
        ref={ref2}
        type="tel"
        inputMode="numeric"
        maxLength={4}
        placeholder="0000"
        value={middle}
        onChange={handleMiddleChange}
        onKeyDown={(e) => { preventNonDigit(e); handleBackspace(2, middle, e) }}
        className={`${inputBase} flex-1 min-w-0`}
      />
      <span className="text-gray-300 shrink-0 text-lg font-light">—</span>
      <input
        ref={ref3}
        type="tel"
        inputMode="numeric"
        maxLength={4}
        placeholder="0000"
        value={last}
        onChange={handleLastChange}
        onKeyDown={(e) => { preventNonDigit(e); handleBackspace(3, last, e) }}
        className={`${inputBase} flex-1 min-w-0`}
      />
    </div>
  )
}
