import { render, screen } from '@testing-library/react'
import FailPage from '@/app/fail/page'
import { describe, it, expect, beforeEach } from '@jest/globals'
import { useSearchParams } from 'next/navigation'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}))

describe('결제 실패 페이지', () => {
  beforeEach(() => {
    ;(useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => {
        const params: Record<string, string> = {
          code: 'PAYMENT_CANCELED',
          message: '사용자가 결제를 취소했습니다',
        }
        return params[key] || null
      },
    })
  })

  it('결제 실패 메시지가 표시된다', () => {
    render(<FailPage />)

    expect(screen.getByText(/결제가 실패했습니다/)).toBeInTheDocument()
  })

  it('실패 사유가 표시된다', () => {
    render(<FailPage />)

    expect(screen.getByText(/사용자가 결제를 취소했습니다/)).toBeInTheDocument()
  })

  it('에러 코드가 표시된다', () => {
    render(<FailPage />)

    expect(screen.getByText(/PAYMENT_CANCELED/)).toBeInTheDocument()
  })

  it('다시 시도하기 링크가 있다', () => {
    render(<FailPage />)

    expect(screen.getByRole('link', { name: /다시 시도/ })).toBeInTheDocument()
  })

  it('홈으로 가기 링크가 있다', () => {
    render(<FailPage />)

    expect(screen.getByRole('link', { name: /홈으로/ })).toBeInTheDocument()
  })
})
