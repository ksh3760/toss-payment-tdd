import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CheckoutPage from '@/app/checkout/page'
import { describe, it, expect, beforeEach } from '@jest/globals'
import { useSearchParams } from 'next/navigation'
import {
  loadPaymentWidget,
  mockRenderPaymentMethods,
  mockRenderAgreement,
  mockRequestPayment,
  resetMocks,
} from '@/__mocks__/@tosspayments/payment-widget-sdk'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}))

describe('결제 페이지', () => {
  beforeEach(() => {
    resetMocks()
    ;(useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => {
        const params: Record<string, string> = {
          productId: '1',
          name: '홍길동',
          email: 'test@example.com',
          phone: '01012345678',
        }
        return params[key] || null
      },
    })
  })

  it('주문 정보가 표시된다', async () => {
    render(<CheckoutPage />)

    await waitFor(() => {
      expect(screen.getByText('개발의 신 프리미엄')).toBeInTheDocument()
      expect(screen.getByText(/50,000원/)).toBeInTheDocument()
      expect(screen.getByText('홍길동')).toBeInTheDocument()
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })
  })

  it('토스 페이먼트 위젯이 로드된다', async () => {
    render(<CheckoutPage />)

    await waitFor(() => {
      expect(loadPaymentWidget).toHaveBeenCalled()
    })
  })

  it('결제 수단 선택 UI가 렌더링된다', async () => {
    render(<CheckoutPage />)

    await waitFor(() => {
      expect(mockRenderPaymentMethods).toHaveBeenCalled()
    })
  })

  it('결제 약관 동의 UI가 렌더링된다', async () => {
    render(<CheckoutPage />)

    await waitFor(() => {
      expect(mockRenderAgreement).toHaveBeenCalled()
    })
  })

  it('결제하기 버튼 클릭 시 결제 요청이 실행된다', async () => {
    const user = userEvent.setup()
    render(<CheckoutPage />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /결제하기/ })).toBeInTheDocument()
    })

    const payButton = screen.getByRole('button', { name: /결제하기/ })
    await user.click(payButton)

    await waitFor(() => {
      expect(mockRequestPayment).toHaveBeenCalled()
    })
  })

  it('결제 요청 시 올바른 정보가 전달된다', async () => {
    const user = userEvent.setup()
    render(<CheckoutPage />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /결제하기/ })).toBeInTheDocument()
    })

    const payButton = screen.getByRole('button', { name: /결제하기/ })
    await user.click(payButton)

    await waitFor(() => {
      expect(mockRequestPayment).toHaveBeenCalledWith(
        expect.objectContaining({
          orderId: expect.any(String),
          orderName: '개발의 신 프리미엄',
          amount: 50000,
          customerName: '홍길동',
          customerEmail: 'test@example.com',
        })
      )
    })
  })
})
