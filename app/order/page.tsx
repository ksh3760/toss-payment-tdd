'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Product } from '@/lib/products'
import { localStorageProducts } from '@/lib/localStorage'
import ProductSummary from '@/components/ProductSummary'
import OrderForm from '@/components/OrderForm'
import BackButton from '@/components/BackButton'

export default function OrderPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const productId = searchParams.get('productId')

  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!productId) {
      setIsLoading(false)
      return
    }

    const foundProduct = localStorageProducts.getById(productId)
    setProduct(foundProduct || null)
    setIsLoading(false)
  }, [productId])

  const handleFormSubmit = (formData: {
    name: string
    email: string
    phone: string
  }) => {
    const queryParams = new URLSearchParams({
      productId: productId || '',
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    })

    router.push(`/checkout?${queryParams.toString()}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-gray-600">상품을 찾을 수 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <BackButton href="/products" />
        </div>

        <h1 className="text-3xl font-bold mb-8">주문하기</h1>

        <div className="mb-8">
          <ProductSummary product={product} />
        </div>

        <OrderForm productId={productId || ''} onSubmit={handleFormSubmit} />
      </div>
    </div>
  )
}
