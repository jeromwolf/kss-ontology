# KSS Ontology 배포 가이드

프로덕션 환경에서 KSS Ontology를 배포하고 배치 작업을 스케줄링하는 방법

---

## 배포 방법 비교

### 방법 1: PM2 (권장)

**장점**:
- Next.js 서버와 스케줄러를 동시에 관리
- 자동 재시작, 로그 관리, 모니터링 기능
- 클러스터 모드 지원
- 개발/스테이징/프로덕션 환경 분리 가능

**단점**:
- PM2 설치 및 설정 필요

**사용 케이스**: 프로덕션 서버, 장기 운영

### 방법 2: Cron + Next.js

**장점**:
- 시스템 cron 사용으로 안정성 높음
- 설정이 간단함
- Next.js 서버와 독립적으로 실행

**단점**:
- Next.js 서버는 별도 관리 필요
- 로그 관리 수동 설정
- 모니터링 기능 제한적

**사용 케이스**: 간단한 배포, 테스트 환경

### 방법 3: Docker + Kubernetes

**장점**:
- 컨테이너 기반 격리
- 자동 스케일링
- 클라우드 네이티브

**단점**:
- 복잡도 높음
- 인프라 구축 비용

**사용 케이스**: 대규모 서비스, 클라우드 배포

---

## 방법 1: PM2 배포 (권장)

### 1. PM2 설치

```bash
npm install -g pm2
```

### 2. 프로덕션 빌드

```bash
cd web
npm run build
```

### 3. 환경 변수 설정

```bash
cp .env.example .env.local
```

`.env.local` 파일 편집:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/kss_ontology

# API Keys
NAVER_CLIENT_ID=your_client_id
NAVER_CLIENT_SECRET=your_client_secret
OPENAI_API_KEY=your_openai_key

# Scheduler (PM2에서 자동 설정되므로 생략 가능)
# ENABLE_DAILY_BATCH=true
# ENABLE_HEALTH_CHECK=true

# Notifications (선택)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### 4. PM2로 시작

```bash
pm2 start scripts/pm2.config.js
```

### 5. PM2 모니터링

```bash
# 프로세스 상태 확인
pm2 list

# 실시간 로그 확인
pm2 logs

# 실시간 모니터링
pm2 monit

# 특정 앱 재시작
pm2 restart kss-ontology
pm2 restart kss-scheduler

# 모든 앱 중지
pm2 stop all

# PM2 프로세스 저장 (재부팅 시 자동 시작)
pm2 save
pm2 startup
```

### 6. 로그 확인

```bash
# PM2 로그
pm2 logs kss-scheduler

# 직접 로그 파일 확인
tail -f logs/scheduler-out.log
tail -f logs/scheduler-error.log
```

---

## 방법 2: Cron 배포

### 1. Next.js 서버 시작

```bash
cd web
npm run build
npm run start
```

또는 PM2로 Next.js만 실행:

```bash
pm2 start npm --name "kss-web" -- start
```

### 2. Cron 작업 설정

스크립트 실행:

```bash
chmod +x scripts/setup-cron.sh
./scripts/setup-cron.sh
```

또는 수동 설정:

```bash
crontab -e
```

다음 라인 추가:

```bash
# KSS Ontology 일일 배치 작업 (매일 오전 9시)
0 9 * * * cd /path/to/kss-ontology/web && npx tsx scripts/daily-batch-job.ts >> /path/to/logs/cron.log 2>&1
```

### 3. Cron 작업 확인

```bash
# 등록된 cron 작업 확인
crontab -l

# 로그 확인
tail -f logs/cron.log
```

### 4. Cron 작업 제거

```bash
crontab -e
# 해당 라인 삭제 후 저장
```

---

## 배치 작업 스케줄

### 기본 스케줄 (권장)

| 작업 | 스케줄 | Cron 표현식 | 설명 |
|------|--------|------------|------|
| 일일 배치 | 매일 오전 9시 | `0 9 * * *` | 뉴스 수집 및 Triple 추출 |
| 헬스 체크 | 5분마다 | `*/5 * * * *` | DB 연결 상태 확인 |
| 주간 재평가 | 일요일 오전 3시 | `0 3 * * 0` | Triple 신뢰도 재평가 (향후 구현) |
| 월간 아카이빙 | 매월 1일 오전 2시 | `0 2 1 * *` | 오래된 데이터 정리 (향후 구현) |

### 스케줄 수정 방법

#### PM2 사용 시

`scripts/pm2.config.js` 파일 편집:

```javascript
env: {
  ENABLE_DAILY_BATCH: 'true',
  ENABLE_HEALTH_CHECK: 'true',
}
```

또는 `lib/services/scheduler.ts`의 cron 표현식 수정:

```typescript
this.addJob({
  name: 'daily-batch',
  schedule: '0 6 * * *',  // 오전 6시로 변경
  ...
})
```

수정 후 재시작:

```bash
pm2 restart kss-scheduler
```

#### Cron 사용 시

```bash
crontab -e
```

시간 변경 후 저장.

---

## 알림 설정

### Slack 알림

1. Slack Webhook URL 생성:
   - https://api.slack.com/messaging/webhooks

2. 환경 변수 설정:
```bash
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00/B00/XXX
```

3. 테스트:
```bash
curl -X POST "$SLACK_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"text":"KSS Ontology 알림 테스트"}'
```

### Discord 알림

1. Discord Webhook URL 생성:
   - Discord 서버 설정 > 통합 > 웹훅

2. 환경 변수 설정:
```bash
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/XXX/YYY
```

---

## 모니터링

### 시스템 상태 확인

```bash
# PM2 대시보드
pm2 monit

# 프로세스 상태
pm2 list

# CPU/메모리 사용량
pm2 status
```

### 로그 모니터링

```bash
# 실시간 로그
pm2 logs kss-scheduler --lines 100

# 에러 로그만
pm2 logs kss-scheduler --err

# 로그 파일 직접 확인
tail -f logs/scheduler-out.log
tail -f logs/scheduler-error.log
tail -f logs/cron.log
```

### 작업 실행 이력 확인

API로 스케줄러 상태 조회:

```bash
curl http://localhost:3000/api/scheduler
```

응답 예시:

```json
{
  "jobs": [
    {
      "name": "daily-batch",
      "schedule": "0 9 * * *",
      "enabled": true,
      "lastRun": "2025-01-13T00:00:00.000Z",
      "nextRun": "2025-01-14T00:00:00.000Z"
    }
  ]
}
```

---

## 트러블슈팅

### 문제 1: 배치 작업이 실행되지 않음

**원인**: 스케줄러가 비활성화되어 있음

**해결**:

```bash
# PM2: 환경 변수 확인
pm2 env kss-scheduler | grep ENABLE

# Cron: crontab 확인
crontab -l
```

### 문제 2: API 키 오류

**원인**: 환경 변수가 올바르게 설정되지 않음

**해결**:

```bash
# .env.local 파일 확인
cat .env.local | grep -E "NAVER|OPENAI|DATABASE"

# PM2 재시작
pm2 restart all
```

### 문제 3: 데이터베이스 연결 오류

**원인**: PostgreSQL 서버가 실행되지 않음 또는 연결 문자열 오류

**해결**:

```bash
# PostgreSQL 상태 확인
pg_isready -h localhost -p 5432

# 데이터베이스 연결 테스트
psql -d kss_ontology -c "SELECT NOW()"
```

### 문제 4: 메모리 부족

**원인**: 배치 작업 실행 중 메모리 초과

**해결**:

`scripts/pm2.config.js`에서 메모리 제한 증가:

```javascript
max_memory_restart: '1G',  // 512M → 1G로 증가
```

---

## 성능 최적화

### 1. 배치 작업 병렬화

현재는 순차 처리 중. 향후 병렬 처리로 개선 가능:

```typescript
// scripts/daily-batch-job.ts
const results = await Promise.all(
  companies.map(company => processCompany(company))
)
```

### 2. Redis 캐싱

자주 조회되는 데이터를 Redis에 캐싱:

```bash
# Redis 설치
brew install redis  # macOS
sudo apt install redis  # Ubuntu

# Redis 시작
redis-server

# 환경 변수 설정
ENABLE_REDIS=true
REDIS_URL=redis://localhost:6379
```

### 3. 데이터베이스 인덱스

Triple 조회 성능 향상:

```sql
-- 이미 적용됨
CREATE INDEX idx_triples_spo ON knowledge_triples(subject, predicate, object);
CREATE INDEX idx_triples_confidence ON knowledge_triples(confidence DESC);
```

---

## 백업 및 복구

### 데이터베이스 백업

```bash
# 일일 백업 (cron에 추가)
0 2 * * * pg_dump kss_ontology > /backups/kss_$(date +\%Y\%m\%d).sql

# 수동 백업
pg_dump kss_ontology > backup_$(date +%Y%m%d).sql
```

### 데이터베이스 복구

```bash
# 복구
psql kss_ontology < backup_20250113.sql
```

---

## 보안 체크리스트

- [ ] `.env.local` 파일이 `.gitignore`에 포함되어 있음
- [ ] API 키가 소스 코드에 하드코딩되지 않음
- [ ] 데이터베이스 비밀번호가 강력함
- [ ] PostgreSQL이 localhost에만 바인딩되어 있음 (외부 접근 차단)
- [ ] PM2 로그 파일 권한이 적절함 (`chmod 600`)
- [ ] Webhook URL이 환경 변수로 관리됨

---

## 다음 단계

1. **모니터링 대시보드 추가** (Phase 3)
   - 실시간 Triple 통계
   - 배치 작업 실행 이력
   - 시스템 헬스 메트릭

2. **사용자 인증 시스템** (Phase 3)
   - NextAuth.js 통합
   - 사용자별 피드백 이력

3. **실시간 알림 강화** (Phase 3)
   - 이메일 알림 구현
   - 웹 푸시 알림

---

**작성일**: 2025-01-13
**버전**: 1.0
**상태**: Production Ready
