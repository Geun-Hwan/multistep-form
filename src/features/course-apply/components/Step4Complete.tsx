'use client'

import type { ApplicationSuccessResponse } from '../types'

interface Props {
  result: ApplicationSuccessResponse
  onReset: () => void
}

export default function Step4Complete({ result, onReset }: Props) {
  const formattedDate = new Date(result.submittedAt).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="text-center py-8 flex flex-col items-center gap-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-3xl">
        ✓
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-gray-900">{result.message}</h2>
      </div>
      <dl className="bg-gray-50 rounded-xl px-6 py-4 text-sm w-full max-w-xs space-y-2 text-left">
        <div className="flex justify-between">
          <dt className="text-gray-500">신청 번호</dt>
          <dd className="font-medium text-gray-900">{result.applicationId}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">신청 일시</dt>
          <dd className="font-medium text-gray-900">{formattedDate}</dd>
        </div>
      </dl>
      <button type="button" onClick={onReset} className="btn-primary">
        처음으로 돌아가기
      </button>
    </div>
  )
}
