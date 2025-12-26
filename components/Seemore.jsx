'use client'
import React from 'react'
import { useRouter } from 'next/navigation' // Use navigation, not router

const Seemore = ({ page }) => {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.push(`?page=${page}`)} 
      className="px-12 py-2.5 border rounded text-gray-500/70 hover:bg-slate-50/90 transition"
    >
      See more
    </button>
  )
}

export default Seemore;