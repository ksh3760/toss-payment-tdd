export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Toss Payments TDD</h1>
        <p className="text-lg text-gray-600 mb-8">
          Test-Driven Development로 구현한 토스페이먼츠 결제 시스템
        </p>
        <div className="space-y-4">
          <a
            href="/products"
            className="block p-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            상품 목록 보기 →
          </a>
          <a
            href="/admin/products"
            className="block p-6 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            상품 관리 (관리자) →
          </a>
        </div>
      </main>
    </div>
  );
}
