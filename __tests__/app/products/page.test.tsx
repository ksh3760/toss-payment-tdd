import { render, screen } from '@testing-library/react'
import ProductsPage from '@/app/products/page'
import { describe, it, expect } from '@jest/globals'

describe('상품 목록 페이지', () => {
  it('상품 목록이 렌더링된다', () => {
    render(<ProductsPage />)

    expect(screen.getByText('상품 목록')).toBeInTheDocument()
  })

  it('최소 1개 이상의 상품 카드가 표시된다', () => {
    render(<ProductsPage />)

    const productCards = screen.getAllByTestId('product-card')
    expect(productCards.length).toBeGreaterThan(0)
  })

  it('각 상품 카드에 상품명, 가격, 설명이 표시된다', () => {
    render(<ProductsPage />)

    // 첫 번째 상품 확인
    expect(screen.getByText('개발의 신 프리미엄')).toBeInTheDocument()
    expect(screen.getByText(/50,000원/)).toBeInTheDocument()
    expect(screen.getByText('AI 챗봇 무제한 이용권 (1개월)')).toBeInTheDocument()
  })

  it('각 상품 카드에 "구매하기" 버튼이 있다', () => {
    render(<ProductsPage />)

    const buyButtons = screen.getAllByRole('link', { name: /구매하기/ })
    expect(buyButtons.length).toBeGreaterThan(0)
  })
})
