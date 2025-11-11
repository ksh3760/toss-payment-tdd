import { NextRequest, NextResponse } from 'next/server'
import { localStorageProducts } from '@/lib/localStorage'

export async function GET() {
  // 클라이언트에서 localStorage를 직접 사용하도록 안내
  // 이 API는 SSR/ISR을 위한 fallback으로만 사용
  return NextResponse.json({
    products: [],
    message: 'Use client-side localStorage directly'
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, price, description } = body

    if (!name || !price || !description) {
      return NextResponse.json(
        { error: '필수 항목이 누락되었습니다' },
        { status: 400 }
      )
    }

    const newProduct = productStore.create({
      name,
      price: Number(price),
      description,
    })

    return NextResponse.json({ product: newProduct }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: '상품 추가에 실패했습니다' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, price, description } = body

    if (!id) {
      return NextResponse.json(
        { error: '상품 ID가 필요합니다' },
        { status: 400 }
      )
    }

    const updatedProduct = productStore.update(id, {
      ...(name && { name }),
      ...(price && { price: Number(price) }),
      ...(description && { description }),
    })

    if (!updatedProduct) {
      return NextResponse.json(
        { error: '상품을 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    return NextResponse.json({ product: updatedProduct })
  } catch (error) {
    return NextResponse.json(
      { error: '상품 수정에 실패했습니다' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: '상품 ID가 필요합니다' },
        { status: 400 }
      )
    }

    const success = productStore.delete(id)

    if (!success) {
      return NextResponse.json(
        { error: '상품을 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: '상품 삭제에 실패했습니다' },
      { status: 500 }
    )
  }
}
