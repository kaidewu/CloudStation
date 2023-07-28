import React from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <div className="bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="flex justify-center items-center h-screen">
        <div className="flex space-x-4">
          <Link href="/drive">
            <div
              className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:scale-105 transition-transform duration-300 ease-in-out dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Drive</h5>
            </div>
          </Link>

          <Link href="/logs">
            <div
              className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:scale-105 transition-transform duration-300 ease-in-out dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Logs</h5>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
