'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import BackButton from '@/components/BackButton'

export default function FailPage() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const message = searchParams.get('message')

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <div className="mb-6">
            <svg
              className="w-16 h-16 text-red-500 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            결제가 실패했습니다
          </h1>

          <div className="bg-white rounded-lg p-6 mb-6 text-left">
            <div className="space-y-3">
              <div>
                <span className="text-gray-600 block mb-1">실패 사유</span>
                <span className="font-medium">{message || '알 수 없는 오류'}</span>
              </div>
              <div>
                <span className="text-gray-600 block mb-1">에러 코드</span>
                <span className="font-mono text-sm">{code || 'UNKNOWN'}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            >
              다시 시도하기
            </Link>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
