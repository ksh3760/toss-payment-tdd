import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminProductsPage from '@/app/admin/products/page'
import { describe, it, expect } from '@jest/globals'

describe('상품 관리 페이지', () => {
  it('기존 상품 목록이 표시된다', () => {
    render(<AdminProductsPage />)

    expect(screen.getByText('상품 관리')).toBeInTheDocument()
    expect(screen.getByText('개발의 신 프리미엄')).toBeInTheDocument()
    expect(screen.getByText('개발의 신 스탠다드')).toBeInTheDocument()
    expect(screen.getByText('개발의 신 베이직')).toBeInTheDocument()
  })

  it('각 상품에 수정 버튼이 있다', () => {
    render(<AdminProductsPage />)

    const editButtons = screen.getAllByRole('button', { name: /수정/ })
    expect(editButtons.length).toBeGreaterThanOrEqual(3)
  })

  it('각 상품에 삭제 버튼이 있다', () => {
    render(<AdminProductsPage />)

    const deleteButtons = screen.getAllByRole('button', { name: /삭제/ })
    expect(deleteButtons.length).toBeGreaterThanOrEqual(3)
  })

  it('새 상품 추가 버튼이 있다', () => {
    render(<AdminProductsPage />)

    expect(screen.getByRole('button', { name: /새 상품 추가/ })).toBeInTheDocument()
  })

  it('새 상품 추가 버튼 클릭 시 입력 폼이 표시된다', async () => {
    const user = userEvent.setup()
    render(<AdminProductsPage />)

    const addButton = screen.getByRole('button', { name: /새 상품 추가/ })
    await user.click(addButton)

    await waitFor(() => {
      expect(screen.getByLabelText(/상품명/)).toBeInTheDocument()
      expect(screen.getByLabelText(/가격/)).toBeInTheDocument()
      expect(screen.getByLabelText(/설명/)).toBeInTheDocument()
    })
  })

  it('새 상품을 추가할 수 있다', async () => {
    const user = userEvent.setup()
    render(<AdminProductsPage />)

    // 추가 버튼 클릭
    await user.click(screen.getByRole('button', { name: /새 상품 추가/ }))

    // 폼 입력
    await user.type(screen.getByLabelText(/상품명/), '개발의 신 엔터프라이즈')
    await user.type(screen.getByLabelText(/가격/), '100000')
    await user.type(screen.getByLabelText(/설명/), '무제한 이용권')

    // 저장 버튼 클릭
    await user.click(screen.getByRole('button', { name: /저장/ }))

    // 새 상품이 목록에 추가됨
    await waitFor(() => {
      expect(screen.getByText('개발의 신 엔터프라이즈')).toBeInTheDocument()
      expect(screen.getByText('100,000원')).toBeInTheDocument()
    })
  })

  it('상품을 수정할 수 있다', async () => {
    const user = userEvent.setup()
    render(<AdminProductsPage />)

    // 첫 번째 상품의 수정 버튼 클릭
    const editButtons = screen.getAllByRole('button', { name: /수정/ })
    await user.click(editButtons[0])

    // 폼이 기존 값으로 채워짐
    await waitFor(() => {
      const nameInput = screen.getByLabelText(/상품명/) as HTMLInputElement
      expect(nameInput.value).toBe('개발의 신 프리미엄')
    })

    // 가격 수정
    const priceInput = screen.getByLabelText(/가격/) as HTMLInputElement
    await user.clear(priceInput)
    await user.type(priceInput, '60000')

    // 저장
    await user.click(screen.getByRole('button', { name: /저장/ }))

    // 수정된 내용 확인
    await waitFor(() => {
      expect(screen.getByText('60,000원')).toBeInTheDocument()
    })
  })

  it('상품을 삭제할 수 있다', async () => {
    const user = userEvent.setup()
    render(<AdminProductsPage />)

    // 삭제 전 상품 존재 확인
    expect(screen.getByText('개발의 신 베이직')).toBeInTheDocument()

    // 마지막 상품의 삭제 버튼 클릭
    const deleteButtons = screen.getAllByRole('button', { name: /삭제/ })
    await user.click(deleteButtons[deleteButtons.length - 1])

    // 확인 다이얼로그에서 확인 (window.confirm을 mock)
    // 삭제 후 상품이 목록에서 사라짐
    await waitFor(() => {
      const basicProducts = screen.queryAllByText('개발의 신 베이직')
      expect(basicProducts.length).toBe(0)
    })
  })

  it('필수 항목 없이 저장 시 에러 메시지가 표시된다', async () => {
    const user = userEvent.setup()
    render(<AdminProductsPage />)

    await user.click(screen.getByRole('button', { name: /새 상품 추가/ }))

    // 빈 폼으로 저장 시도
    await user.click(screen.getByRole('button', { name: /저장/ }))

    await waitFor(() => {
      expect(screen.getByText(/상품명을 입력해주세요/)).toBeInTheDocument()
    })
  })
})
