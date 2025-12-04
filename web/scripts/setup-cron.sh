#!/bin/bash

###############################################################################
# KSS Ontology - Cron Job Setup Script
#
# 이 스크립트는 일일 배치 작업을 crontab에 등록합니다.
#
# 사용법:
#   chmod +x scripts/setup-cron.sh
#   ./scripts/setup-cron.sh
#
# 작업 스케줄:
#   - 일일 배치 작업: 매일 오전 9시 (Asia/Seoul)
###############################################################################

# 프로젝트 디렉토리 (절대 경로)
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
WEB_DIR="$PROJECT_DIR"

# Node.js 경로 확인
NODE_PATH=$(which node)
NPX_PATH=$(which npx)

echo "🚀 KSS Ontology Cron Job 설정"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "프로젝트 디렉토리: $WEB_DIR"
echo "Node.js 경로: $NODE_PATH"
echo "npx 경로: $NPX_PATH"
echo ""

# Cron 작업 정의
CRON_JOB="0 9 * * * cd $WEB_DIR && $NPX_PATH tsx scripts/daily-batch-job.ts >> $WEB_DIR/logs/cron.log 2>&1"

# 로그 디렉토리 생성
mkdir -p "$WEB_DIR/logs"

echo "📋 등록할 Cron 작업:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "$CRON_JOB"
echo ""

# 기존 crontab 백업
echo "💾 기존 crontab 백업 중..."
crontab -l > "$WEB_DIR/logs/crontab.backup.$(date +%Y%m%d_%H%M%S)" 2>/dev/null || echo "# No existing crontab" > "$WEB_DIR/logs/crontab.backup.$(date +%Y%m%d_%H%M%S)"

# 기존 KSS Ontology cron 작업 제거 (있다면)
echo "🧹 기존 KSS Ontology cron 작업 제거 중..."
(crontab -l 2>/dev/null | grep -v "daily-batch-job.ts") | crontab -

# 새 cron 작업 추가
echo "✅ 새로운 cron 작업 추가 중..."
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Cron 작업 등록 완료!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📅 현재 등록된 crontab:"
crontab -l
echo ""
echo "📝 로그 파일 위치:"
echo "   $WEB_DIR/logs/cron.log"
echo ""
echo "🔍 로그 확인 방법:"
echo "   tail -f $WEB_DIR/logs/cron.log"
echo ""
echo "🛑 Cron 작업 제거 방법:"
echo "   crontab -e"
echo "   (해당 라인 삭제 후 저장)"
echo ""
