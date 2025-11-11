'use client'

import { useRouter } from 'next/navigation'

interface BackButtonProps {
  label?: string
  href?: string
}

export default function BackButton({ label = '← 뒤로가기', href }: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
    >
      {label}
    </button>
  )
}
