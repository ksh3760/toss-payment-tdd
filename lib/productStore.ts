import { Product } from './products'

// 메모리 기반 간단한 저장소 (실제 환경에서는 DB 사용)
let productsData: Product[] = [
  {
    id: '1',
    name: '개발의 신 프리미엄',
    price: 50000,
    description: 'AI 챗봇 무제한 이용권 (1개월)',
  },
  {
    id: '2',
    name: '개발의 신 스탠다드',
    price: 30000,
    description: 'AI 챗봇 일일 100회 이용권 (1개월)',
  },
  {
    id: '3',
    name: '개발의 신 베이직',
    price: 10000,
    description: 'AI 챗봇 일일 10회 이용권 (1개월)',
  },
]

export const productStore = {
  getAll: (): Product[] => {
    return [...productsData]
  },

  getById: (id: string): Product | undefined => {
    return productsData.find(p => p.id === id)
  },

  create: (product: Omit<Product, 'id'>): Product => {
    const newProduct: Product = {
      id: Date.now().toString(),
      ...product,
    }
    productsData.push(newProduct)
    return newProduct
  },

  update: (id: string, product: Partial<Omit<Product, 'id'>>): Product | null => {
    const index = productsData.findIndex(p => p.id === id)
    if (index === -1) return null

    productsData[index] = {
      ...productsData[index],
      ...product,
    }
    return productsData[index]
  },

  delete: (id: string): boolean => {
    const index = productsData.findIndex(p => p.id === id)
    if (index === -1) return false

    productsData.splice(index, 1)
    return true
  },

  // 테스트용: 데이터 초기화
  reset: (): void => {
    productsData = [
      {
        id: '1',
        name: '개발의 신 프리미엄',
        price: 50000,
        description: 'AI 챗봇 무제한 이용권 (1개월)',
      },
      {
        id: '2',
        name: '개발의 신 스탠다드',
        price: 30000,
        description: 'AI 챗봇 일일 100회 이용권 (1개월)',
      },
      {
        id: '3',
        name: '개발의 신 베이직',
        price: 10000,
        description: 'AI 챗봇 일일 10회 이용권 (1개월)',
      },
    ]
  },
}
