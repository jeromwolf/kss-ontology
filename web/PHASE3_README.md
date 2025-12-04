# Phase 3: Scheduler & Notification System

**완료 일자**: 2025년 11월 12일
**구현 범위**: 배치 작업 스케줄링 및 알림 시스템

---

## 구현된 기능

### 1. Job Scheduler (작업 스케줄러)

**위치**: `lib/services/scheduler.ts`

#### 기능
- node-cron 기반 작업 스케줄링
- 4가지 기본 작업 등록:
  - `daily-batch`: 일일 뉴스 수집 및 Triple 추출 (매일 오전 9시)
  - `weekly-reevaluation`: 주간 Triple 재평가 (매주 일요일 오전 3시)
  - `monthly-archiving`: 월간 데이터 아카이빙 (매월 1일 오전 2시)
  - `health-check`: 시스템 헬스 체크 (5분마다)

#### 주요 메서드
```typescript
scheduler.initialize()                    // 스케줄러 초기화
scheduler.runJobManually(jobName)         // 작업 수동 실행
scheduler.toggleJob(jobName, enabled)     // 작업 활성화/비활성화
scheduler.stopAll()                       // 모든 작업 중지
scheduler.getJobStatus(jobName?)          // 작업 상태 조회
scheduler.printSchedule()                 // 스케줄 출력
```

#### 환경 변수
```bash
# 각 작업 활성화/비활성화 (true/false)
ENABLE_DAILY_BATCH=false
ENABLE_WEEKLY_REEVALUATION=false
ENABLE_MONTHLY_ARCHIVING=false
ENABLE_HEALTH_CHECK=false
```

### 2. Notification System (알림 시스템)

**위치**: `lib/services/notification.ts`

#### 지원 채널
1. **콘솔 로그** (기본, 항상 활성)
2. **Slack 웹훅** (선택)
3. **Discord 웹훅** (선택)
4. **이메일** (향후 구현 예정)

#### 알림 타입
```typescript
type NotificationType =
  | 'job_success'          // 작업 성공
  | 'job_failure'          // 작업 실패
  | 'system_error'         // 시스템 오류
  | 'data_quality_alert'   // 데이터 품질 경고
  | 'info'                 // 일반 정보
```

#### 사용 예시
```typescript
import { sendNotification, notifyJobSuccess } from '@/lib/services/notification'

// 기본 알림
await sendNotification({
  type: 'job_success',
  title: '배치 작업 완료',
  message: '56개 Triple 추출 완료',
  timestamp: new Date(),
})

// 헬퍼 함수
await notifyJobSuccess('daily-batch', '120초')
await notifyJobFailure('daily-batch', 'API 오류', '30초')
await notifySystemError('Database 연결 오류', error.message)
```

#### 환경 변수
```bash
# Slack 웹훅 URL (선택)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Discord 웹훅 URL (선택)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR/WEBHOOK/URL

# 이메일 (향후 구현 예정)
NOTIFICATION_EMAIL=admin@example.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 3. Scheduler Management API

**위치**: `app/api/scheduler/route.ts`

#### 엔드포인트

**GET `/api/scheduler`**
- 스케줄러 상태 조회
- Query: `?job=<jobName>` (선택)

```bash
# 모든 작업 상태 조회
curl http://localhost:3000/api/scheduler

# 특정 작업 상태 조회
curl http://localhost:3000/api/scheduler?job=daily-batch
```

**POST `/api/scheduler`**
- 스케줄러 제어

```bash
# 스케줄러 초기화
curl -X POST http://localhost:3000/api/scheduler \
  -H "Content-Type: application/json" \
  -d '{"action":"initialize"}'

# 작업 수동 실행
curl -X POST http://localhost:3000/api/scheduler \
  -H "Content-Type: application/json" \
  -d '{"action":"run","jobName":"daily-batch"}'

# 작업 활성화
curl -X POST http://localhost:3000/api/scheduler \
  -H "Content-Type: application/json" \
  -d '{"action":"toggle","jobName":"daily-batch","enabled":true}'

# 작업 비활성화
curl -X POST http://localhost:3000/api/scheduler \
  -H "Content-Type: application/json" \
  -d '{"action":"toggle","jobName":"daily-batch","enabled":false}'

# 모든 작업 중지
curl -X POST http://localhost:3000/api/scheduler \
  -H "Content-Type: application/json" \
  -d '{"action":"stop-all"}'
```

---

## 설정 가이드

### 1. 기본 설정 (로컬 개발)

1. **환경 변수 설정**
```bash
cp .env.example .env.local
```

2. **스케줄러 활성화 (선택)**
```bash
# .env.local에 추가
ENABLE_DAILY_BATCH=true
ENABLE_HEALTH_CHECK=true
```

3. **서버 시작**
```bash
npm run dev
```

4. **스케줄러 초기화** (자동 실행됨)
```bash
# 또는 API로 초기화
curl -X POST http://localhost:3000/api/scheduler \
  -H "Content-Type: application/json" \
  -d '{"action":"initialize"}'
```

### 2. Slack 알림 설정

1. **Slack Webhook URL 생성**
   - https://api.slack.com/messaging/webhooks 방문
   - "Create your Slack app" 클릭
   - Incoming Webhooks 활성화
   - Webhook URL 복사

2. **환경 변수에 추가**
```bash
# .env.local
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX
```

3. **테스트**
```typescript
import { sendNotification } from '@/lib/services/notification'

await sendNotification({
  type: 'info',
  title: 'Slack 알림 테스트',
  message: '연동 성공!',
  timestamp: new Date(),
})
```

### 3. Discord 알림 설정

1. **Discord Webhook URL 생성**
   - Discord 서버 설정 > 통합 > 웹훅
   - 웹훅 만들기
   - 웹훅 URL 복사

2. **환경 변수에 추가**
```bash
# .env.local
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/1234567890/abcdefghijklmnopqrstuvwxyz
```

### 4. 프로덕션 설정

1. **Cron 표현식 확인**
```
0 9 * * *     # 매일 오전 9시
0 3 * * 0     # 매주 일요일 오전 3시
0 2 1 * *     # 매월 1일 오전 2시
*/5 * * * *   # 5분마다
```

2. **타임존 설정**
```typescript
// lib/services/scheduler.ts
{
  scheduled: false,
  timezone: 'Asia/Seoul',  // 한국 시간
}
```

3. **프로덕션 환경 변수**
```bash
# 배치 작업 활성화
ENABLE_DAILY_BATCH=true
ENABLE_WEEKLY_REEVALUATION=true
ENABLE_MONTHLY_ARCHIVING=true
ENABLE_HEALTH_CHECK=true

# 알림 채널 설정
SLACK_WEBHOOK_URL=<your_slack_webhook>
DISCORD_WEBHOOK_URL=<your_discord_webhook>
```

---

## 테스트

### 1. 스케줄러 테스트

**실행 방법**:
```bash
npx tsx scripts/test-scheduler.ts
```

**테스트 케이스**:
1. 스케줄러 초기화
2. 스케줄러 상태 조회
3. 특정 작업 상태 조회
4. 작업 활성화
5. 작업 비활성화
6. 수동 작업 실행 (안내)

**테스트 결과**:
```
✅ 테스트 1: 스케줄러 초기화 성공
✅ 테스트 2: 스케줄러 상태 조회 성공 (4개 작업)
✅ 테스트 3: 특정 작업 상태 조회 성공
✅ 테스트 4: 작업 활성화 성공
✅ 테스트 5: 작업 비활성화 성공
```

### 2. 수동 배치 작업 실행

**일일 배치 작업 실행**:
```bash
# API 사용
curl -X POST http://localhost:3000/api/scheduler \
  -H "Content-Type: application/json" \
  -d '{"action":"run","jobName":"daily-batch"}'

# 또는 스크립트 직접 실행
npx tsx scripts/daily-batch-job.ts
```

### 3. 알림 테스트

**콘솔 알림**:
```typescript
await sendNotification({
  type: 'info',
  title: '테스트 알림',
  message: '알림 시스템 테스트',
  timestamp: new Date(),
})
```

**Slack/Discord 알림**:
```bash
# 환경 변수 설정 후
npx tsx scripts/test-scheduler.ts
# health-check 작업 활성화 시 5분마다 알림 발송됨
```

---

## 운영 가이드

### 1. 일일 배치 작업 모니터링

**방법 1: 로그 확인**
```bash
# 서버 로그 확인
tail -f logs/scheduler.log

# 또는 PM2 사용 시
pm2 logs
```

**방법 2: API로 상태 확인**
```bash
curl http://localhost:3000/api/scheduler?job=daily-batch
```

**방법 3: Slack/Discord 알림 수신**
- 작업 성공/실패 시 자동 알림
- 오류 발생 시 스택 트레이스 포함

### 2. 배치 작업 스케줄 변경

**파일 수정**: `lib/services/scheduler.ts`

```typescript
// 매일 오전 9시 → 오전 6시로 변경
this.addJob({
  name: 'daily-batch',
  schedule: '0 6 * * *',  // 변경
  handler: this.runDailyBatchJob.bind(this),
  enabled: process.env.ENABLE_DAILY_BATCH === 'true',
})
```

**서버 재시작**:
```bash
npm run dev  # 개발
pm2 restart app  # 프로덕션
```

### 3. 긴급 작업 실행

**즉시 실행**:
```bash
curl -X POST http://localhost:3000/api/scheduler \
  -H "Content-Type: application/json" \
  -d '{"action":"run","jobName":"daily-batch"}'
```

**모든 작업 중지**:
```bash
curl -X POST http://localhost:3000/api/scheduler \
  -H "Content-Type: application/json" \
  -d '{"action":"stop-all"}'
```

### 4. 오류 처리

**오류 발생 시 자동 처리**:
- 알림 자동 발송 (Slack/Discord)
- 오류 로그 기록
- 재시도 없음 (수동 실행 필요)

**수동 재실행**:
```bash
# API 사용
curl -X POST http://localhost:3000/api/scheduler \
  -H "Content-Type: application/json" \
  -d '{"action":"run","jobName":"daily-batch"}'

# 또는 스크립트 직접 실행
npx tsx scripts/daily-batch-job.ts
```

---

## 향후 개선 사항

### 1. 재시도 로직 추가
- 작업 실패 시 자동 재시도 (최대 3회)
- Exponential backoff 구현

### 2. 작업 큐 시스템
- Bull Queue 도입
- Redis 기반 작업 큐
- 병렬 처리 지원

### 3. 이메일 알림 구현
- Nodemailer 통합
- HTML 이메일 템플릿
- 일일/주간 요약 리포트

### 4. 모니터링 대시보드
- 작업 실행 이력 UI
- 실시간 상태 모니터링
- 성능 메트릭 시각화

### 5. 작업 우선순위 관리
- 우선순위 기반 실행
- 리소스 사용률 제한
- 동시 실행 제한

---

## 트러블슈팅

### 문제 1: 스케줄러가 작동하지 않음

**원인**: 환경 변수 미설정

**해결**:
```bash
# .env.local 확인
ENABLE_DAILY_BATCH=true
```

### 문제 2: 알림이 발송되지 않음

**원인**: Webhook URL 미설정

**해결**:
```bash
# .env.local 확인
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

### 문제 3: 작업이 중복 실행됨

**원인**: 스케줄러 중복 초기화

**해결**:
```typescript
// lib/services/scheduler.ts
if (this.isInitialized) {
  console.log('⚠️  스케줄러가 이미 초기화되어 있습니다.')
  return
}
```

### 문제 4: Cron 표현식 오류

**원인**: 잘못된 Cron 표현식

**해결**:
```typescript
// Cron 유효성 검증
if (!cron.validate(schedule)) {
  console.error(`❌ 잘못된 cron 표현식: ${schedule}`)
  return
}
```

**Cron 표현식 참고**:
- https://crontab.guru/
- https://crontab-generator.org/

---

## 관련 파일

**스케줄러**:
- `lib/services/scheduler.ts` - 스케줄러 서비스
- `app/api/scheduler/route.ts` - 스케줄러 API
- `scripts/test-scheduler.ts` - 스케줄러 테스트

**알림**:
- `lib/services/notification.ts` - 알림 서비스

**배치 작업**:
- `scripts/daily-batch-job.ts` - 일일 배치 작업
- `lib/services/triple-extractor.ts` - Triple 추출 엔진
- `lib/services/ontology-query.ts` - 온톨로지 쿼리 엔진

**환경 설정**:
- `.env.example` - 환경 변수 예제
- `.env.local` - 로컬 환경 변수 (생성 필요)

---

## 참고 자료

**node-cron**:
- https://github.com/node-cron/node-cron
- https://www.npmjs.com/package/node-cron

**Slack Webhooks**:
- https://api.slack.com/messaging/webhooks

**Discord Webhooks**:
- https://discord.com/developers/docs/resources/webhook

**Cron 표현식**:
- https://crontab.guru/

---

**작성일**: 2025년 11월 12일
**버전**: 1.0
**상태**: Phase 3 (High Priority) 완료
