import { POST } from '@/app/api/confirm-payment/route'
import { NextRequest } from 'next/server'
import { describe, it, expect, beforeEach } from '@jest/globals'

// Mock fetch for Toss API calls
global.fetch = jest.fn()

describe('POST /api/confirm-payment', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('올바른 요청 시 결제 승인에 성공한다', async () => {
    const mockTossResponse = {
      orderId: 'ORDER_123',
      paymentKey: 'test_key_123',
      status: 'DONE',
    }

    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTossResponse,
    })

    const request = new NextRequest('http://localhost:3000/api/confirm-payment', {
      method: 'POST',
      body: JSON.stringify({
        orderId: 'ORDER_123',
        paymentKey: 'test_key_123',
        amount: 50000,
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
  })

  it('필수 파라미터가 없으면 400 에러를 반환한다', async () => {
    const request = new NextRequest('http://localhost:3000/api/confirm-payment', {
      method: 'POST',
      body: JSON.stringify({
        orderId: 'ORDER_123',
        // paymentKey와 amount 누락
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBeDefined()
  })

  it('토스 API 호출 실패 시 에러를 반환한다', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({
        code: 'INVALID_PAYMENT_KEY',
        message: '유효하지 않은 결제 키입니다',
      }),
    })

    const request = new NextRequest('http://localhost:3000/api/confirm-payment', {
      method: 'POST',
      body: JSON.stringify({
        orderId: 'ORDER_123',
        paymentKey: 'invalid_key',
        amount: 50000,
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBeDefined()
  })

  it('토스 API에 올바른 인증 헤더를 포함한다', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'DONE' }),
    })

    const request = new NextRequest('http://localhost:3000/api/confirm-payment', {
      method: 'POST',
      body: JSON.stringify({
        orderId: 'ORDER_123',
        paymentKey: 'test_key_123',
        amount: 50000,
      }),
    })

    await POST(request)

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.tosspayments.com/v1/payments/confirm',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: expect.stringContaining('Basic'),
        }),
      })
    )
  })
})
