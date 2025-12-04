'use client'

/**
 * Swagger UI 페이지
 * API 문서를 인터랙티브하게 탐색할 수 있는 페이지
 */

import { useEffect, useState } from 'react'
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

export default function ApiDocsPage() {
  const [spec, setSpec] = useState<any>(null)

  useEffect(() => {
    // API 스펙 가져오기
    fetch('/api/docs')
      .then((res) => res.json())
      .then((data) => setSpec(data))
      .catch((err) => console.error('Failed to load API docs:', err))
  }, [])

  if (!spec) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading API Documentation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              KSS Ontology API Documentation
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              한국 공급망 네트워크 온톨로지 시스템 공식 API 문서
            </p>
          </div>
        </div>

        <div className="bg-white">
          <SwaggerUI spec={spec} />
        </div>
      </div>
    </div>
  )
}
