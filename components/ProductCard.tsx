import Link from 'next/link'
import { Product } from '@/lib/products'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div
      data-testid="product-card"
      className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
      <p className="text-2xl font-bold text-blue-600 mb-3">
        {product.price.toLocaleString('ko-KR')}원
      </p>
      <p className="text-gray-600 mb-4">{product.description}</p>
      <Link
        href={`/order?productId=${product.id}`}
        className="block w-full py-2 px-4 bg-blue-500 text-white text-center rounded hover:bg-blue-600 transition-colors"
      >
        구매하기
      </Link>
    </div>
  )
}
