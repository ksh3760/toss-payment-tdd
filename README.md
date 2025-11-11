# Toss Payments TDD 프로젝트

Test-Driven Development (TDD) 방법론으로 구현한 Toss Payments 결제 시스템입니다.

## 프로젝트 개요

이 프로젝트는 TDD의 Red-Green-Refactor 사이클을 엄격히 따라 개발되었습니다:
- **Red**: 실패하는 테스트 먼저 작성
- **Green**: 테스트를 통과하는 최소한의 코드 작성
- **Refactor**: 코드 개선 및 리팩토링

## 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Testing**: Jest + React Testing Library
- **Styling**: Tailwind CSS
- **Payment**: Toss Payments Widget SDK

## 프로젝트 구조

```
toss-payment-tdd/
├── app/
│   ├── page.tsx                    # 홈 페이지
│   ├── products/page.tsx           # 상품 목록 페이지
│   ├── order/page.tsx              # 주문 페이지
│   ├── checkout/page.tsx           # 결제 페이지
│   ├── success/page.tsx            # 결제 성공 페이지
│   ├── fail/page.tsx               # 결제 실패 페이지
│   └── api/
│       └── confirm-payment/route.ts # 결제 승인 API
├── components/
│   ├── ProductCard.tsx             # 상품 카드 컴포넌트
│   ├── ProductSummary.tsx          # 상품 요약 컴포넌트
│   └── OrderForm.tsx               # 주문 폼 컴포넌트
├── lib/
│   └── products.ts                 # 상품 데이터 및 유틸리티
├── __mocks__/
│   └── @tosspayments/
│       └── payment-widget-sdk.ts   # Toss SDK Mock
└── __tests__/
    └── app/                        # 페이지별 테스트 파일
```

## TDD 사이클별 구현 내역

### Cycle 1: Products Page (상품 목록 페이지)
- **Red**: 상품 목록 렌더링, 상품 카드 표시, 구매하기 버튼 테스트 작성
- **Green**: ProductsPage 컴포넌트 구현
- **Refactor**: ProductCard 컴포넌트 분리, products 데이터 lib로 이동
- **Tests**: 4 passed

### Cycle 2: Order Form (주문 페이지)
- **Red**: 상품 정보 표시, 주문자 정보 폼, 유효성 검사 테스트 작성
- **Green**: OrderPage 컴포넌트 구현
- **Refactor**: OrderForm, ProductSummary 컴포넌트 분리
- **Tests**: 4 passed

### Cycle 3: Payment Widget (결제 위젯)
- **Red**: Toss Widget 로드, 결제 수단/약관 렌더링, 결제 요청 테스트 작성
- **Green**: CheckoutPage 구현, Toss SDK 통합
- **Refactor**: 환경 변수 설정, Jest 모듈 매핑 추가
- **Tests**: 6 passed

### Cycle 4: Success/Fail Pages (결제 결과 페이지)
- **Red**: 성공/실패 메시지, 주문 정보, 네비게이션 테스트 작성
- **Green**: SuccessPage, FailPage 구현
- **Tests**: 10 passed

### Cycle 5: Payment Confirmation API (결제 승인 API)
- **Red**: API 요청, 파라미터 검증, 에러 처리 테스트 작성
- **Green**: /api/confirm-payment 엔드포인트 구현
- **Implementation**: Toss Payments Confirm API 연동

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일이 이미 테스트 키로 설정되어 있습니다:

```env
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq
TOSS_SECRET_KEY=test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R
```

실제 운영 환경에서는 [Toss Payments 개발자 센터](https://developers.tosspayments.com/)에서 발급받은 키를 사용하세요.

### 3. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 애플리케이션이 실행됩니다.

### 4. 테스트 실행

```bash
# 전체 테스트 실행
npm test

# Watch 모드
npm run test:watch

# 커버리지 확인
npm run test:coverage
```

## 테스트 현황

총 **24개의 테스트**가 통과했습니다:

- Products Page: 4 tests ✅
- Order Page: 4 tests ✅
- Checkout Page: 6 tests ✅
- Success Page: 5 tests ✅
- Fail Page: 5 tests ✅

## 주요 기능

### 1. 상품 목록 페이지 (`/products`)
- 3가지 요금제 표시
- 상품별 가격 및 설명
- 구매하기 버튼

### 2. 주문 페이지 (`/order`)
- 선택한 상품 정보 표시
- 주문자 정보 입력 폼 (이름, 이메일, 전화번호)
- 클라이언트 사이드 유효성 검사

### 3. 결제 페이지 (`/checkout`)
- Toss Payments Widget 통합
- 결제 수단 선택
- 약관 동의
- 실시간 결제 처리

### 4. 결과 페이지
- **성공 페이지** (`/success`): 주문 번호, 결제 금액 표시
- **실패 페이지** (`/fail`): 에러 코드 및 사유 표시

### 5. 결제 승인 API
- POST `/api/confirm-payment`
- Toss Payments Confirm API 연동
- 서버 사이드 결제 승인 처리

## Mock Strategy

테스트 환경에서 실제 Toss SDK를 호출하지 않도록 Mock을 구현했습니다:

```typescript
// __mocks__/@tosspayments/payment-widget-sdk.ts
export const loadPaymentWidget = jest.fn().mockResolvedValue({
  renderPaymentMethods: jest.fn(),
  renderAgreement: jest.fn(),
  requestPayment: jest.fn().mockResolvedValue({ success: true }),
})
```

이를 통해:
- 빠른 테스트 실행
- 외부 API 의존성 제거
- 다양한 시나리오 테스트 가능

## 학습 포인트

이 프로젝트를 통해 학습할 수 있는 내용:

1. **TDD 방법론**: Red-Green-Refactor 사이클의 실제 적용
2. **Next.js App Router**: 최신 Next.js 아키텍처
3. **결제 시스템 통합**: Toss Payments Widget SDK 사용법
4. **테스트 작성**: Jest + RTL을 활용한 컴포넌트 테스트
5. **TypeScript**: 타입 안정성을 갖춘 React 개발
6. **Mock 전략**: 외부 의존성 Mock 처리

## 라이센스

MIT

## 참고 자료

- [Toss Payments 문서](https://docs.tosspayments.com/)
- [Next.js 공식 문서](https://nextjs.org/docs)
- [Jest 공식 문서](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
