import { NextRequest, NextResponse } from 'next/server'

const SECRET_KEY = process.env.TOSS_SECRET_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, paymentKey, amount } = body

    // 필수 파라미터 검증
    if (!orderId || !paymentKey || !amount) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다' },
        { status: 400 }
      )
    }

    // Toss Payments API 호출
    const response = await fetch(
      'https://api.tosspayments.com/v1/payments/confirm',
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${SECRET_KEY}:`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          paymentKey,
          amount,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.message || '결제 승인에 실패했습니다',
          code: data.code,
        },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      ...data,
    })
  } catch (error) {
    console.error('결제 승인 에러:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
