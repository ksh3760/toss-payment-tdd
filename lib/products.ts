export interface Product {
  id: string
  name: string
  price: number
  description: string
}

// 모든 상품은 localStorage에서만 관리됩니다
// lib/localStorage.ts를 사용하세요
