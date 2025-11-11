import { Product } from '@/lib/products'

interface ProductSummaryProps {
  product: Product
}

export default function ProductSummary({ product }: ProductSummaryProps) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
      <p className="text-2xl font-bold text-blue-600">
        {product.price.toLocaleString('ko-KR')}원
      </p>
      <p className="text-gray-600 mt-2">{product.description}</p>
    </div>
  )
}
