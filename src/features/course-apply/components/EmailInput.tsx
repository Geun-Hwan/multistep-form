'use client'

import { useEffect, useRef, useState } from 'react'

const PRESET_DOMAINS = ['naver.com', 'gmail.com', 'daum.net', 'kakao.com', 'nate.com', 'yahoo.com']
const CUSTOM = '직접입력'

function parseEmail(email: string) {
  const at = email.indexOf('@')
  if (at < 0) return { local: email, domain: '', isCustom: false }
  const local = email.slice(0, at)
  const domain = email.slice(at + 1)
  return { local, domain, isCustom: !!domain && !PRESET_DOMAINS.includes(domain) }
}

interface Props {
  value: string
  onChange: (v: string) => void
  onBlur: () => void
}

export default function EmailInput({ value, onChange, onBlur }: Props) {
  const { local: initLocal, domain: initDomain, isCustom: initIsCustom } = parseEmail(value)

  const [local, setLocal] = useState(initLocal)
  const [selectedDomain, setSelectedDomain] = useState(initIsCustom ? CUSTOM : initDomain)
  const [customDomain, setCustomDomain] = useState(initIsCustom ? initDomain : '')
  const internalRef = useRef(false)

  // sessionStorage 복원 등 외부에서 value가 바뀌면 로컬 상태를 동기화
  useEffect(() => {
    if (internalRef.current) {
      internalRef.current = false
      return
    }
    const { local: l, domain: d, isCustom } = parseEmail(value)
    setLocal(l)
    setSelectedDomain(isCustom ? CUSTOM : d)
    setCustomDomain(isCustom ? d : '')
  }, [value])

  const emit = (l: string, sel: string, custom: string) => {
    internalRef.current = true
    const domain = sel === CUSTOM ? custom : sel
    onChange(domain ? `${l}@${domain}` : l)
  }

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const l = e.target.value
    setLocal(l)
    emit(l, selectedDomain, customDomain)
  }

  const handleDomainSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sel = e.target.value
    setSelectedDomain(sel)
    const newCustom = sel === CUSTOM ? customDomain : ''
    if (sel !== CUSTOM) setCustomDomain('')
    emit(local, sel, newCustom)
  }

  const handleCustomDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = e.target.value
    setCustomDomain(d)
    emit(local, CUSTOM, d)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <input
          id="email"
          type="text"
          value={local}
          onChange={handleLocalChange}
          onBlur={onBlur}
          placeholder="아이디"
          autoComplete="username"
          className="input min-w-0 flex-1"
        />
        <span className="shrink-0 text-gray-400 font-medium text-sm">@</span>
        <select
          id="emailDomain"
          value={selectedDomain}
          onChange={handleDomainSelect}
          className="input min-w-0 flex-1"
        >
          <option value="">선택</option>
          {PRESET_DOMAINS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
          <option value={CUSTOM}>{CUSTOM}</option>
        </select>
      </div>
      {selectedDomain === CUSTOM && (
        <input
          type="text"
          value={customDomain}
          onChange={handleCustomDomainChange}
          placeholder="도메인 직접 입력 (예: company.co.kr)"
          className="input"
        />
      )}
    </div>
  )
}
