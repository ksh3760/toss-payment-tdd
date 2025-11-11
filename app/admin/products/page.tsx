'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/lib/products'
import { localStorageProducts } from '@/lib/localStorage'
import BackButton from '@/components/BackButton'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // 상품 목록 로드
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = () => {
    const storedProducts = localStorageProducts.getAll()
    setProducts(storedProducts)
    setIsLoadingProducts(false)
  }

  const handleAddNew = () => {
    setEditingProduct(null)
    setFormData({ name: '', price: '', description: '' })
    setErrors({})
    setIsFormOpen(true)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
    })
    setErrors({})
    setIsFormOpen(true)
  }

  const handleDelete = (productId: string) => {
    const success = localStorageProducts.delete(productId)
    if (success) {
      setProducts(products.filter((p) => p.id !== productId))
    } else {
      alert('상품 삭제에 실패했습니다')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = '상품명을 입력해주세요'
    }

    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = '올바른 가격을 입력해주세요'
    }

    if (!formData.description.trim()) {
      newErrors.description = '설명을 입력해주세요'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    if (editingProduct) {
      // 수정
      const updated = localStorageProducts.update(editingProduct.id, {
        name: formData.name,
        price: Number(formData.price),
        description: formData.description,
      })

      if (updated) {
        setProducts(
          products.map((p) => (p.id === editingProduct.id ? updated : p))
        )
      }
    } else {
      // 추가
      const newProduct = localStorageProducts.create({
        name: formData.name,
        price: Number(formData.price),
        description: formData.description,
      })

      setProducts([...products, newProduct])
    }

    setIsFormOpen(false)
    setFormData({ name: '', price: '', description: '' })
    setEditingProduct(null)
  }

  const handleCancel = () => {
    setIsFormOpen(false)
    setFormData({ name: '', price: '', description: '' })
    setEditingProduct(null)
    setErrors({})
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <BackButton href="/" />
        </div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">상품 관리</h1>
          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            새 상품 추가
          </button>
        </div>

        {/* 상품 목록 */}
        {products.length === 0 ? (
          <div className="text-center py-12 mb-8">
            <p className="text-gray-600 mb-4">등록된 상품이 없습니다.</p>
            <p className="text-sm text-gray-500">
              "새 상품 추가" 버튼을 클릭하여 첫 상품을 등록하세요.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-2xl font-bold text-blue-600 mb-3">
                  {product.price.toLocaleString('ko-KR')}원
                </p>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 추가/수정 폼 */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">
                {editingProduct ? '상품 수정' : '새 상품 추가'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    상품명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium mb-2">
                    가격 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium mb-2"
                  >
                    설명 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    저장
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
