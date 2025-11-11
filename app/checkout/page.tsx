'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Product } from '@/lib/products'
import { localStorageProducts } from '@/lib/localStorage'
import ProductSummary from '@/components/ProductSummary'
import BackButton from '@/components/BackButton'
import { loadPaymentWidget, ANONYMOUS } from '@tosspayments/payment-widget-sdk'

const CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || ''

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const productId = searchParams.get('productId')
  const customerName = searchParams.get('name')
  const customerEmail = searchParams.get('email')
  const customerPhone = searchParams.get('phone')

  const [product, setProduct] = useState<Product | null>(null)
  const [isLoadingProduct, setIsLoadingProduct] = useState(true)

  const paymentWidgetRef = useRef<any>(null)
  const paymentMethodsRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isReady, setIsReady] = useState(false)

  // 상품 로드
  useEffect(() => {
    if (!productId) {
      setIsLoadingProduct(false)
      return
    }

    const foundProduct = localStorageProducts.getById(productId)
    setProduct(foundProduct || null)
    setIsLoadingProduct(false)
  }, [productId])

  // 위젯 로드
  useEffect(() => {
    if (!product || !customerEmail || isLoadingProduct) return

    const loadWidget = async () => {
      try {
        const paymentWidget = await loadPaymentWidget(CLIENT_KEY, customerEmail)
        paymentWidgetRef.current = paymentWidget

        // DOM이 준비될 때까지 대기
        await new Promise(resolve => setTimeout(resolve, 100))

        const paymentMethodsWidget = await paymentWidget.renderPaymentMethods(
          '#payment-methods',
          { value: product.price }
        )
        paymentMethodsRef.current = paymentMethodsWidget

        await paymentWidget.renderAgreement('#agreement')

        // 렌더링이 완료될 때까지 대기
        await new Promise(resolve => setTimeout(resolve, 1000))

        setIsLoading(false)
        setIsReady(true)
      } catch (error) {
        console.error('결제 위젯 로드 실패:', error)
        setIsLoading(false)
      }
    }

    loadWidget()
  }, [product, customerEmail, isLoadingProduct])

  const handlePayment = async () => {
    if (!isReady || !paymentWidgetRef.current || !product || !customerName || !customerEmail) {
      alert('결제 위젯이 로딩 중입니다. 잠시 후 다시 시도해주세요.')
      return
    }

    try {
      const orderId = `ORDER_${Date.now()}`

      await paymentWidgetRef.current.requestPayment({
        orderId,
        orderName: product.name,
        amount: product.price,
        customerName,
        customerEmail,
        successUrl: `${window.location.origin}/success?orderId=${orderId}`,
        failUrl: `${window.location.origin}/fail`,
      })
    } catch (error: any) {
      console.error('결제 요청 실패:', error)
      if (error.message) {
        alert(`결제 실패: ${error.message}`)
      }
    }
  }

  if (!product || !customerName || !customerEmail) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-gray-600">주문 정보를 찾을 수 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <BackButton />
        </div>

        <h1 className="text-3xl font-bold mb-8">결제하기</h1>

        {/* 주문 정보 */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">주문 정보</h2>
          <ProductSummary product={product} />
        </div>

        {/* 주문자 정보 */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">주문자 정보</h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">이름:</span> {customerName}
            </p>
            <p>
              <span className="font-medium">이메일:</span> {customerEmail}
            </p>
            <p>
              <span className="font-medium">전화번호:</span> {customerPhone}
            </p>
          </div>
        </div>

        {/* 결제 수단 선택 */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">결제 수단</h2>
          <div id="payment-methods" className="border rounded-lg p-4" />
        </div>

        {/* 약관 동의 */}
        <div className="mb-6">
          <div id="agreement" />
        </div>

        {/* 결제하기 버튼 */}
        <button
          onClick={handlePayment}
          disabled={!isReady}
          className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? '결제 위젯 로딩 중...' : '결제하기'}
        </button>
      </div>
    </div>
  )
}
