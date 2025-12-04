/**
 * OpenAPI/Swagger 문서 정의
 * KSS Ontology API 문서화
 */

import { createSwaggerSpec } from 'next-swagger-doc'

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'KSS Ontology API',
        version: '1.0.0',
        description: `
# KSS Ontology API Documentation

한국 공급망 네트워크 온톨로지 시스템의 공식 API 문서입니다.

## 주요 기능

- **Triple 관리**: 지식 그래프 Triple CRUD 작업
- **온톨로지 쿼리**: SPARQL 스타일 쿼리 및 관계 탐색
- **데이터 품질**: 자동 검증 및 중복 감지
- **분석**: 실시간 통계 및 추이 분석
- **스케줄러**: 배치 작업 관리

## 인증

현재 베타 버전에서는 인증이 필요하지 않습니다.
향후 API 키 기반 인증이 추가될 예정입니다.

## 응답 형식

모든 API는 다음 형식으로 응답합니다:

\`\`\`json
{
  "success": true,
  "data": { ... }
}
\`\`\`

오류 시:

\`\`\`json
{
  "success": false,
  "error": "오류 메시지"
}
\`\`\`

## Rate Limiting

현재 Rate Limiting이 적용되지 않습니다.
프로덕션 환경에서는 IP당 분당 100회로 제한될 예정입니다.
        `,
        contact: {
          name: 'KSS Ontology Team',
          email: 'support@kss-ontology.com',
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT',
        },
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
        {
          url: 'https://api.kss-ontology.com',
          description: 'Production server',
        },
      ],
      tags: [
        {
          name: 'Triples',
          description: '지식 그래프 Triple 관리',
        },
        {
          name: 'Ontology',
          description: '온톨로지 쿼리 및 탐색',
        },
        {
          name: 'Analytics',
          description: '통계 및 분석',
        },
        {
          name: 'Quality',
          description: '데이터 품질 관리',
        },
        {
          name: 'Scheduler',
          description: '배치 작업 스케줄러',
        },
        {
          name: 'News',
          description: '뉴스 수집 및 처리',
        },
      ],
      components: {
        schemas: {
          Triple: {
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'Triple ID' },
              subject: { type: 'string', description: '주어 (Subject)' },
              predicate: { type: 'string', description: '술어 (Predicate)' },
              object: { type: 'string', description: '목적어 (Object)' },
              confidence: {
                type: 'number',
                format: 'float',
                minimum: 0,
                maximum: 1,
                description: '신뢰도 (0.0-1.0)',
              },
              validated_by: {
                type: 'string',
                enum: ['baseline', 'gpt', 'user'],
                description: '검증 방법',
              },
              created_at: {
                type: 'string',
                format: 'date-time',
                description: '생성 시간',
              },
            },
          },
          AnalyticsData: {
            type: 'object',
            properties: {
              triples: {
                type: 'object',
                description: 'Triple 통계',
              },
              trends: {
                type: 'object',
                description: '일별 추이',
              },
              relationTypes: {
                type: 'array',
                description: '관계 타입 분포',
              },
              companies: {
                type: 'array',
                description: '기업별 통계',
              },
            },
          },
          QualityReport: {
            type: 'object',
            properties: {
              timestamp: {
                type: 'string',
                format: 'date-time',
                description: '검사 시간',
              },
              totalIssues: {
                type: 'integer',
                description: '총 이슈 수',
              },
              issuesByType: {
                type: 'object',
                description: '이슈 타입별 집계',
              },
              issues: {
                type: 'array',
                description: '이슈 목록',
              },
              recommendations: {
                type: 'array',
                items: { type: 'string' },
                description: '권장사항',
              },
            },
          },
          Error: {
            type: 'object',
            properties: {
              success: {
                type: 'boolean',
                example: false,
              },
              error: {
                type: 'string',
                description: '오류 메시지',
              },
            },
          },
        },
        responses: {
          Success: {
            description: '성공 응답',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    data: {
                      type: 'object',
                    },
                  },
                },
              },
            },
          },
          Error: {
            description: '오류 응답',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
  })

  return spec
}
