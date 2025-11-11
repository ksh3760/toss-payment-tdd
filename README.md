# Toss Payments 상품 결제 시스템

**TDD 방법론으로 구현한 완전한 상품 결제 솔루션**

이 프로젝트는 상품 관리부터 결제 완료까지의 전체 프로세스를 포함한 실무 수준의 결제 시스템입니다.

## 프로젝트 개요

### TDD (Test-Driven Development) 적용

모든 기능은 TDD의 Red-Green-Refactor 사이클을 엄격히 따라 개발되었습니다:
- **Red**: 실패하는 테스트 먼저 작성
- **Green**: 테스트를 통과하는 최소한의 코드 작성
- **Refactor**: 코드 개선 및 리팩토링

### 주요 특징

- ✅ **완전한 상품 관리 시스템**: 관리자 페이지에서 상품 CRUD 작업
- ✅ **localStorage 기반 데이터 영속성**: 브라우저 새로고침 후에도 데이터 유지
- ✅ **실제 결제 통합**: Toss Payments Widget SDK 완전 통합
- ✅ **반응형 디자인**: 모바일, 태블릿, 데스크톱 모두 지원
- ✅ **포괄적인 테스트**: 24개의 테스트로 주요 기능 검증
- ✅ **사용자 친화적 UI**: 직관적인 네비게이션과 명확한 피드백

## 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Testing**: Jest + React Testing Library
- **Styling**: Tailwind CSS
- **Payment**: Toss Payments Widget SDK

## 시스템 플로우

```
1. 홈페이지 (/)
   → 상품 관리 또는 상품 목록 선택

2. [고객용] 상품 목록 (/products)
   → 상품 선택 및 구매하기

3. 주문 페이지 (/order?productId=...)
   → 주문자 정보 입력 (이름, 이메일, 전화번호)

4. 결제 페이지 (/checkout)
   → Toss Payments 위젯으로 결제

5. 결제 결과
   ✅ 성공 (/success) → 주문 정보 확인
   ❌ 실패 (/fail) → 에러 메시지 및 재시도

[관리자용] 상품 관리 (/admin/products)
   → 상품 추가, 수정, 삭제 (localStorage에 저장)
```

## 프로젝트 구조

```
toss-payments-product-payment-system/
├── app/
│   ├── page.tsx                      # 홈 페이지 (메인 메뉴)
│   ├── products/page.tsx             # 상품 목록 페이지 (고객용)
│   ├── admin/
│   │   └── products/page.tsx         # 상품 관리 페이지 (관리자용)
│   ├── order/page.tsx                # 주문 페이지
│   ├── checkout/page.tsx             # 결제 페이지 (Toss Widget)
│   ├── success/page.tsx              # 결제 성공 페이지
│   ├── fail/page.tsx                 # 결제 실패 페이지
│   └── api/
│       └── confirm-payment/route.ts  # 결제 승인 API
├── components/
│   ├── BackButton.tsx                # 뒤로가기 버튼 컴포넌트
│   ├── ProductCard.tsx               # 상품 카드 컴포넌트
│   ├── ProductSummary.tsx            # 상품 요약 컴포넌트
│   └── OrderForm.tsx                 # 주문 폼 컴포넌트
├── lib/
│   ├── products.ts                   # 상품 타입 정의
│   └── localStorage.ts               # localStorage 유틸리티
├── __mocks__/
│   └── @tosspayments/
│       └── payment-widget-sdk.ts     # Toss SDK Mock
├── __tests__/
│   └── app/                          # 페이지별 테스트 파일
├── AGENT_SYSTEM_GUIDE.md             # AI 에이전트 시스템 구현 가이드
└── README.md
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

### 1. 홈 페이지 (`/`)
- 메인 메뉴: 상품 관리 / 상품 목록 선택
- 깔끔한 대시보드 UI

### 2. 상품 관리 페이지 (`/admin/products`) - 관리자용
- ✏️ **상품 추가**: 이름, 가격, 설명 입력
- 📝 **상품 수정**: 기존 상품 정보 변경
- 🗑️ **상품 삭제**: 상품 제거
- 💾 **localStorage 저장**: 브라우저에 데이터 영속성 유지
- ✅ **폼 유효성 검사**: 필수 항목 검증
- 📱 **반응형 디자인**: 모든 디바이스 지원

### 3. 상품 목록 페이지 (`/products`) - 고객용
- 등록된 모든 상품 표시 (localStorage에서 로드)
- 상품별 가격 및 설명
- 구매하기 버튼
- 빈 상태(Empty State) 처리

### 4. 주문 페이지 (`/order`)
- 선택한 상품 정보 표시
- 주문자 정보 입력 폼 (이름, 이메일, 전화번호)
- 클라이언트 사이드 유효성 검사
- 실시간 에러 피드백

### 5. 결제 페이지 (`/checkout`)
- Toss Payments Widget 완전 통합
- 주문 정보 및 주문자 정보 확인
- 결제 수단 선택 (카드, 계좌이체, 간편결제 등)
- 약관 동의
- 실시간 결제 처리

### 6. 결과 페이지
- **성공 페이지** (`/success`): 주문 번호, 결제 금액 표시
- **실패 페이지** (`/fail`): 에러 코드 및 사유 표시
- 다음 액션 안내 (홈으로 돌아가기 등)

### 7. 결제 승인 API
- POST `/api/confirm-payment`
- Toss Payments Confirm API 연동
- 서버 사이드 결제 승인 처리

### 8. 네비게이션
- 모든 페이지에 뒤로가기 버튼 제공
- 직관적인 사용자 흐름

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

## 기술적 하이라이트

### 1. localStorage 기반 상태 관리
- 서버 없이 브라우저에서 데이터 영속성 유지
- CRUD 작업 완전 구현
- 새로고침 후에도 데이터 보존

### 2. Toss Payments 완전 통합
- Payment Widget SDK 로드 및 렌더링
- 결제 수단 선택 위젯
- 약관 동의 위젯
- 결제 요청 및 처리
- 성공/실패 핸들링

### 3. 사용자 경험 (UX)
- 모든 페이지 뒤로가기 버튼
- 빈 상태(Empty State) 처리
- 실시간 폼 유효성 검사
- 로딩 상태 표시
- 명확한 에러 메시지

### 4. 반응형 디자인
- Tailwind CSS 활용
- Mobile-first 접근
- Grid 레이아웃으로 카드 배치
- 모든 화면 크기 지원

## 학습 포인트

이 프로젝트를 통해 학습할 수 있는 내용:

1. **TDD 방법론**: Red-Green-Refactor 사이클의 실제 적용
2. **Next.js 15 App Router**: 최신 Next.js 아키텍처와 서버/클라이언트 컴포넌트
3. **결제 시스템 통합**: Toss Payments Widget SDK 사용법
4. **상태 관리**: localStorage를 활용한 클라이언트 사이드 데이터 관리
5. **테스트 작성**: Jest + RTL을 활용한 포괄적인 컴포넌트 테스트
6. **TypeScript**: 타입 안정성을 갖춘 React 개발
7. **Mock 전략**: 외부 의존성 Mock 처리
8. **CRUD 패턴**: Create, Read, Update, Delete 작업 구현
9. **폼 처리**: 유효성 검사와 에러 핸들링
10. **UX 패턴**: 빈 상태, 로딩 상태, 에러 상태 처리

## 향후 개선 사항

### 기능 확장
- [ ] 백엔드 API 연동 (Node.js/Express 또는 Next.js API Routes 확장)
- [ ] 데이터베이스 통합 (PostgreSQL, MongoDB 등)
- [ ] 사용자 인증 및 권한 관리 (NextAuth.js)
- [ ] 주문 내역 조회 기능
- [ ] 상품 카테고리 및 필터링
- [ ] 장바구니 기능
- [ ] 다중 상품 구매
- [ ] 쿠폰 및 할인 시스템

### 기술 개선
- [ ] 서버 컴포넌트 활용 최적화
- [ ] React Query로 데이터 페칭 개선
- [ ] E2E 테스트 추가 (Playwright, Cypress)
- [ ] CI/CD 파이프라인 구축
- [ ] Docker 컨테이너화
- [ ] 성능 최적화 (Code Splitting, Lazy Loading)
- [ ] SEO 최적화
- [ ] 접근성 (a11y) 개선

### UI/UX 개선
- [ ] 다크 모드 지원
- [ ] 애니메이션 및 트랜지션
- [ ] 이미지 업로드 (상품 이미지)
- [ ] 검색 기능
- [ ] 정렬 옵션
- [ ] 페이지네이션

## 추가 자료

### AI 에이전트 시스템
프로젝트에 포함된 `AGENT_SYSTEM_GUIDE.md` 문서에서 IT 제품 개발을 위한 최적화된 AI 에이전트 시스템 구성 방법을 확인할 수 있습니다:

- 5개 핵심 에이전트 아키텍처
- 비용 최적화 전략 ($7-18/day)
- CrewAI 프레임워크 기반 구현
- 완전한 코드 예제 포함

### 프로젝트 스크린샷

실행 중인 애플리케이션은 다음과 같은 화면으로 구성됩니다:

1. **홈 페이지**: 상품 관리 / 상품 목록 메뉴
2. **상품 관리**: 관리자용 CRUD 인터페이스
3. **상품 목록**: 고객용 상품 브라우징
4. **주문 페이지**: 주문자 정보 입력
5. **결제 페이지**: Toss 결제 위젯
6. **결과 페이지**: 성공/실패 처리

## 라이센스

MIT

## 참고 자료

### 공식 문서
- [Toss Payments 개발자 문서](https://docs.tosspayments.com/)
- [Toss Payments Widget SDK](https://docs.tosspayments.com/reference/widget-sdk)
- [Next.js 공식 문서](https://nextjs.org/docs)
- [React 공식 문서](https://react.dev/)
- [TypeScript 공식 문서](https://www.typescriptlang.org/)

### 테스트 프레임워크
- [Jest 공식 문서](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### 스타일링
- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)

### 학습 자료
- [TDD by Example (Kent Beck)](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530)
- [Next.js Tutorial](https://nextjs.org/learn)

## 기여 및 문의

프로젝트에 대한 피드백, 버그 리포트, 기능 제안은 언제든 환영합니다!

---

**Made with TDD ❤️**

프로젝트 버전: 0.1.0
마지막 업데이트: 2025-11-11
