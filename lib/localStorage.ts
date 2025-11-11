import { Product } from './products'

const PRODUCTS_KEY = 'toss-payment-products'

export const localStorageProducts = {
  // 상품 목록 가져오기
  getAll: (): Product[] => {
    if (typeof window === 'undefined') return []

    try {
      const stored = localStorage.getItem(PRODUCTS_KEY)
      if (!stored) {
        // 처음 실행 시 빈 배열로 시작
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify([]))
        return []
      }
      return JSON.parse(stored)
    } catch (error) {
      console.error('Failed to get products from localStorage:', error)
      return []
    }
  },

  // 단일 상품 가져오기
  getById: (id: string): Product | undefined => {
    const products = localStorageProducts.getAll()
    return products.find(p => p.id === id)
  },

  // 상품 추가
  create: (product: Omit<Product, 'id'>): Product => {
    const products = localStorageProducts.getAll()
    const newProduct: Product = {
      id: Date.now().toString(),
      ...product,
    }
    products.push(newProduct)
    localStorageProducts.saveAll(products)
    return newProduct
  },

  // 상품 수정
  update: (id: string, updates: Partial<Omit<Product, 'id'>>): Product | null => {
    const products = localStorageProducts.getAll()
    const index = products.findIndex(p => p.id === id)

    if (index === -1) return null

    products[index] = {
      ...products[index],
      ...updates,
    }
    localStorageProducts.saveAll(products)
    return products[index]
  },

  // 상품 삭제
  delete: (id: string): boolean => {
    const products = localStorageProducts.getAll()
    const filtered = products.filter(p => p.id !== id)

    if (filtered.length === products.length) return false

    localStorageProducts.saveAll(filtered)
    return true
  },

  // 모든 상품 저장
  saveAll: (products: Product[]): void => {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
    } catch (error) {
      console.error('Failed to save products to localStorage:', error)
    }
  },

  // 초기화 (모든 상품 삭제)
  reset: (): void => {
    localStorageProducts.saveAll([])
  },
}
