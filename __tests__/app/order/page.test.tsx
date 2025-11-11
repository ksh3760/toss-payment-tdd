import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OrderPage from '@/app/order/page'
import { describe, it, expect, beforeEach } from '@jest/globals'
import { useSearchParams } from 'next/navigation'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}))

describe('주문 페이지', () => {
  beforeEach(() => {
    ;(useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => (key === 'productId' ? '1' : null),
    })
  })

  it('선택한 상품 정보가 표시된다', () => {
    render(<OrderPage />)

    expect(screen.getByText('개발의 신 프리미엄')).toBeInTheDocument()
    expect(screen.getByText(/50,000원/)).toBeInTheDocument()
  })

  it('주문자 정보 입력 폼이 표시된다', () => {
    render(<OrderPage />)

    expect(screen.getByLabelText(/이름/)).toBeInTheDocument()
    expect(screen.getByLabelText(/이메일/)).toBeInTheDocument()
    expect(screen.getByLabelText(/전화번호/)).toBeInTheDocument()
  })

  it('필수 입력 항목을 입력하지 않으면 다음 단계로 진행할 수 없다', async () => {
    const user = userEvent.setup()
    render(<OrderPage />)

    const submitButton = screen.getByRole('button', { name: /결제하기/ })
    await user.click(submitButton)

    // 검증 메시지 확인
    await waitFor(() => {
      expect(screen.getByText(/이름을 입력해주세요/)).toBeInTheDocument()
    })
  })

  it('유효한 정보를 입력하면 결제 페이지로 이동한다', async () => {
    const user = userEvent.setup()
    const mockPush = jest.fn()

    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({
      push: mockPush,
    })

    render(<OrderPage />)

    // 주문자 정보 입력
    await user.type(screen.getByLabelText(/이름/), '홍길동')
    await user.type(screen.getByLabelText(/이메일/), 'test@example.com')
    await user.type(screen.getByLabelText(/전화번호/), '01012345678')

    // 결제하기 버튼 클릭
    const submitButton = screen.getByRole('button', { name: /결제하기/ })
    await user.click(submitButton)

    // 결제 페이지로 이동 확인
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('/checkout')
      )
    })
  })
})
