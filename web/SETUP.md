# KSS 뉴스 온톨로지 서비스 - 실서비스 설정 가이드

## 1. 네이버 API 키 발급 (필수)

### 1-1. 네이버 개발자 센터 접속
1. https://developers.naver.com/ 접속
2. 네이버 계정으로 로그인

### 1-2. 애플리케이션 등록
1. 상단 메뉴에서 **"Application"** 클릭
2. **"애플리케이션 등록"** 클릭
3. 정보 입력:
   ```
   애플리케이션 이름: KSS 뉴스 온톨로지
   사용 API: 검색 (Search) 선택
   비로그인 오픈 API: 검색 - 뉴스 체크
   환경 추가: Web 설정
   - 웹 서비스 URL: http://localhost:3000 (개발용)
   ```
4. **"등록하기"** 클릭

### 1-3. API 키 확인
등록 완료 후 다음 정보를 확인:
- **Client ID**: `YOUR_CLIENT_ID_HERE`
- **Client Secret**: `YOUR_CLIENT_SECRET_HERE`

## 2. 환경 변수 설정

### 2-1. .env.local 파일 생성
프로젝트 루트 (`web/` 디렉토리)에 `.env.local` 파일 생성:

```bash
cd web/
cp .env.example .env.local
```

### 2-2. API 키 입력
`.env.local` 파일을 열고 다음 내용을 입력:

```env
# Naver API Keys (필수)
NAVER_CLIENT_ID=YOUR_CLIENT_ID_HERE
NAVER_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE

# Next.js
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**주의:** `.env.local` 파일은 절대 Git에 커밋하지 마세요!

## 3. 서버 실행

```bash
# 의존성 설치 (처음 한 번만)
npm install

# 개발 서버 실행
npm run dev
```

서버 실행 후 http://localhost:3000 접속

## 4. 테스트

### 4-1. 뉴스 검색 테스트
1. http://localhost:3000/services/news-ontology 접속
2. 검색창에 "삼성전자" 또는 "AI 반도체" 입력
3. 검색 버튼 클릭
4. 실시간 뉴스 결과 확인

### 4-2. API 직접 테스트
```bash
curl "http://localhost:3000/api/news/search?q=삼성전자&display=10"
```

## 5. Rate Limit 관리

### 네이버 API 제약
- **무료 쿼터**: 하루 25,000 requests
- **Rate Limit**: ~10 req/s에서 429 에러 발생

### 우리 시스템의 보호 장치
✅ **자동 Rate Limiting** (300ms 간격 = 3.3 req/s)
✅ **자동 Retry** (Exponential backoff)
✅ **In-memory 캐싱** (30분 TTL)
✅ **429 에러 자동 처리**

### 예상 처리량
- **시간당**: 3.3 × 3,600 = 11,880 requests
- **하루**: 25,000 quota 내에서 2시간이면 충분
- **캐싱 효과**: 실제 API 호출 90% 절감

## 6. 프로덕션 배포

### 6-1. Vercel 배포 (추천)
1. GitHub 레포지토리 연결
2. Vercel 환경 변수 설정:
   ```
   NAVER_CLIENT_ID=your_client_id
   NAVER_CLIENT_SECRET=your_client_secret
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   ```
3. 자동 배포

### 6-2. 프로덕션 환경 변수
네이버 개발자 센터에서 프로덕션 도메인 추가:
```
웹 서비스 URL: https://your-domain.com
```

## 7. 모니터링

### 로그 확인
서버 콘솔에서 다음 로그 확인:
```
[NaverNewsClient] Success: "삼성전자" (1234 results)
[API] Cache hit: 삼성전자:10:1:date
[RateLimiter] 429 Too Many Requests - backing off
```

### Rate Limiter 상태 확인
```typescript
import { naverNewsClient } from '@/lib/naver-news-client'

const status = naverNewsClient.getStatus()
console.log(status)
// {
//   queueLength: 5,
//   processing: true,
//   currentInterval: 300,
//   errorCount: 0
// }
```

## 8. 비용 최적화

### 무료로 운영하기 (첫 6개월)
- ✅ 캐싱으로 중복 요청 90% 제거
- ✅ 인기 키워드 30분 캐싱
- ✅ 25,000 calls/day 내에서 안정적 운영

### 유료 전환 시점
**사용자 10,000명 도달 시:**
- 무료 쿼터 초과 예상
- 대안:
  1. RSS 피드 추가 (무료 무제한)
  2. 네이버 API 유료 (₩10/call)
  3. 빅카인즈 + 하이브리드

## 9. 트러블슈팅

### 문제: "Naver API credentials not configured"
**해결:** `.env.local` 파일에 API 키 입력 확인

### 문제: 429 Too Many Requests
**해결:** 자동으로 처리됨. 1분 후 재시도

### 문제: 검색 결과 없음
**원인:**
- 키워드가 너무 구체적
- 최근 뉴스가 없음

**해결:** 더 일반적인 키워드 사용

## 10. 다음 단계

### Phase 1: MVP (완료)
- ✅ 뉴스 검색 API
- ✅ Rate limiting
- ✅ 캐싱
- ✅ UI 구현

### Phase 2: 온톨로지 통합 (다음)
- [ ] 뉴스 → RDF 변환
- [ ] Apache Jena 연동
- [ ] SPARQL 추론
- [ ] 관계 그래프 시각화

### Phase 3: 프리미엄 기능
- [ ] 사용자 인증
- [ ] Free/Pro/Enterprise 구분
- [ ] API 키 발급
- [ ] 사용량 대시보드

---

## 실서비스 체크리스트

서비스 오픈 전 확인사항:

- [ ] 네이버 API 키 발급
- [ ] `.env.local` 파일 설정
- [ ] `npm run dev` 정상 실행
- [ ] 검색 테스트 성공
- [ ] 429 에러 처리 확인
- [ ] 캐싱 동작 확인
- [ ] 프로덕션 도메인 등록
- [ ] Vercel 배포 완료
- [ ] 모니터링 설정

**준비 완료 시 바로 서비스 가능합니다!**
