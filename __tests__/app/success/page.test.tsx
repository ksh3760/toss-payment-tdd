import { render, screen, waitFor } from '@testing-library/react'
import SuccessPage from '@/app/success/page'
import { describe, it, expect, beforeEach } from '@jest/globals'
import { useSearchParams } from 'next/navigation'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}))

// Mock fetch
global.fetch = jest.fn()

describe('결제 성공 페이지', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => {
        const params: Record<string, string> = {
          orderId: 'ORDER_123456789',
          paymentKey: 'test_payment_key_123',
          amount: '50000',
        }
        return params[key] || null
      },
    })
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        orderId: 'ORDER_123456789',
        paymentKey: 'test_payment_key_123',
      }),
    })
  })

  it('결제 승인 요청을 서버로 보낸다', async () => {
    render(<SuccessPage />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/confirm-payment',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('ORDER_123456789'),
        })
      )
    })
  })

  it('결제 성공 메시지가 표시된다', async () => {
    render(<SuccessPage />)

    await waitFor(() => {
      expect(screen.getByText(/결제가 완료되었습니다/)).toBeInTheDocument()
    })
  })

  it('주문 번호가 표시된다', async () => {
    render(<SuccessPage />)

    await waitFor(() => {
      expect(screen.getByText(/ORDER_123456789/)).toBeInTheDocument()
    })
  })

  it('결제 금액이 표시된다', async () => {
    render(<SuccessPage />)

    await waitFor(() => {
      expect(screen.getByText(/50,000원/)).toBeInTheDocument()
    })
  })

  it('홈으로 가기 링크가 있다', async () => {
    render(<SuccessPage />)

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /홈으로/ })).toBeInTheDocument()
    })
  })
})
