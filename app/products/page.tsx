'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/lib/products'
import { localStorageProducts } from '@/lib/localStorage'
import ProductCard from '@/components/ProductCard'
import BackButton from '@/components/BackButton'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = () => {
    const storedProducts = localStorageProducts.getAll()
    setProducts(storedProducts)
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <BackButton href="/" />
        </div>

        <h1 className="text-3xl font-bold mb-8">상품 목록</h1>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">등록된 상품이 없습니다.</p>
            <a
              href="/admin/products"
              className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              관리자 페이지에서 상품 추가하기
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
