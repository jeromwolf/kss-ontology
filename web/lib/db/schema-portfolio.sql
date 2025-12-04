/**
 * KSS Ontology - Portfolio Schema
 *
 * 사용자 포트폴리오 연동 스키마
 * - 사용자별 보유 종목
 * - 매수/매도 이력
 * - 포트폴리오 성과 추적
 * - 온톨로지 기반 리스크 분석
 */

-- ============================================
-- Users Table (기본 사용자 정보)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- Portfolios Table (포트폴리오)
-- ============================================
CREATE TABLE IF NOT EXISTS portfolios (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 사용자당 하나의 기본 포트폴리오만 허용
CREATE UNIQUE INDEX idx_user_default_portfolio
ON portfolios(user_id)
WHERE is_default = true;

-- ============================================
-- Holdings Table (보유 종목)
-- ============================================
CREATE TABLE IF NOT EXISTS holdings (
  id SERIAL PRIMARY KEY,
  portfolio_id INTEGER NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  company_uri VARCHAR(200) NOT NULL, -- kss:Company_Samsung 형식
  company_name VARCHAR(100) NOT NULL,
  ticker VARCHAR(20), -- 종목 코드 (예: 005930.KS)
  quantity DECIMAL(18, 6) NOT NULL, -- 보유 수량
  avg_buy_price DECIMAL(18, 2), -- 평균 매수가
  current_price DECIMAL(18, 2), -- 현재가 (업데이트됨)
  notes TEXT, -- 사용자 메모
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(portfolio_id, company_uri)
);

-- 성능 인덱스
CREATE INDEX idx_holdings_portfolio ON holdings(portfolio_id);
CREATE INDEX idx_holdings_company ON holdings(company_uri);

-- ============================================
-- Transactions Table (거래 이력)
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  portfolio_id INTEGER NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  company_uri VARCHAR(200) NOT NULL,
  company_name VARCHAR(100) NOT NULL,
  ticker VARCHAR(20),
  type VARCHAR(10) NOT NULL CHECK (type IN ('buy', 'sell')),
  quantity DECIMAL(18, 6) NOT NULL,
  price DECIMAL(18, 2) NOT NULL, -- 거래 단가
  total_amount DECIMAL(18, 2) NOT NULL, -- 총 거래 금액 (수량 × 단가)
  fee DECIMAL(18, 2) DEFAULT 0, -- 수수료
  executed_at TIMESTAMP NOT NULL, -- 거래 실행 시간
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 성능 인덱스
CREATE INDEX idx_transactions_portfolio ON transactions(portfolio_id);
CREATE INDEX idx_transactions_company ON transactions(company_uri);
CREATE INDEX idx_transactions_executed_at ON transactions(executed_at DESC);

-- ============================================
-- Portfolio Alerts (포트폴리오 알림)
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio_alerts (
  id SERIAL PRIMARY KEY,
  portfolio_id INTEGER NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  company_uri VARCHAR(200) NOT NULL,
  alert_type VARCHAR(50) NOT NULL, -- 'supply_chain_risk', 'competitor_move', 'news_sentiment', etc.
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  data JSONB, -- 추가 데이터 (온톨로지 관계, 뉴스 링크 등)
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 성능 인덱스
CREATE INDEX idx_portfolio_alerts_portfolio ON portfolio_alerts(portfolio_id);
CREATE INDEX idx_portfolio_alerts_company ON portfolio_alerts(company_uri);
CREATE INDEX idx_portfolio_alerts_created_at ON portfolio_alerts(created_at DESC);
CREATE INDEX idx_portfolio_alerts_unread ON portfolio_alerts(portfolio_id, is_read)
WHERE is_read = false;

-- ============================================
-- Portfolio Performance Snapshots (성과 스냅샷)
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio_snapshots (
  id SERIAL PRIMARY KEY,
  portfolio_id INTEGER NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  total_value DECIMAL(18, 2) NOT NULL, -- 총 평가액
  total_cost DECIMAL(18, 2) NOT NULL, -- 총 매수 금액
  realized_profit DECIMAL(18, 2) DEFAULT 0, -- 실현 손익
  unrealized_profit DECIMAL(18, 2) DEFAULT 0, -- 미실현 손익
  daily_return DECIMAL(8, 4), -- 일일 수익률 (%)
  cumulative_return DECIMAL(8, 4), -- 누적 수익률 (%)
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(portfolio_id, snapshot_date)
);

-- 성능 인덱스
CREATE INDEX idx_portfolio_snapshots_portfolio ON portfolio_snapshots(portfolio_id);
CREATE INDEX idx_portfolio_snapshots_date ON portfolio_snapshots(snapshot_date DESC);

-- ============================================
-- Risk Analysis (온톨로지 기반 리스크 분석)
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio_risks (
  id SERIAL PRIMARY KEY,
  portfolio_id INTEGER NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  risk_type VARCHAR(50) NOT NULL, -- 'supply_chain', 'competitor', 'concentration', etc.
  risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  affected_holdings TEXT[], -- company_uri 배열
  description TEXT NOT NULL,
  recommendation TEXT, -- 권장 조치
  ontology_evidence JSONB, -- 온톨로지 Triple 증거
  calculated_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- 성능 인덱스
CREATE INDEX idx_portfolio_risks_portfolio ON portfolio_risks(portfolio_id);
CREATE INDEX idx_portfolio_risks_active ON portfolio_risks(portfolio_id, is_active)
WHERE is_active = true;

-- ============================================
-- Helper Functions
-- ============================================

-- 포트폴리오 총 평가액 계산
CREATE OR REPLACE FUNCTION calculate_portfolio_value(p_portfolio_id INTEGER)
RETURNS DECIMAL(18, 2) AS $$
DECLARE
  total_value DECIMAL(18, 2);
BEGIN
  SELECT COALESCE(SUM(quantity * COALESCE(current_price, avg_buy_price)), 0)
  INTO total_value
  FROM holdings
  WHERE portfolio_id = p_portfolio_id;

  RETURN total_value;
END;
$$ LANGUAGE plpgsql;

-- 포트폴리오 미실현 손익 계산
CREATE OR REPLACE FUNCTION calculate_unrealized_profit(p_portfolio_id INTEGER)
RETURNS DECIMAL(18, 2) AS $$
DECLARE
  unrealized DECIMAL(18, 2);
BEGIN
  SELECT COALESCE(SUM(
    quantity * (COALESCE(current_price, avg_buy_price) - avg_buy_price)
  ), 0)
  INTO unrealized
  FROM holdings
  WHERE portfolio_id = p_portfolio_id;

  RETURN unrealized;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Triggers (자동 업데이트)
-- ============================================

-- updated_at 자동 업데이트
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at
BEFORE UPDATE ON portfolios
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_holdings_updated_at
BEFORE UPDATE ON holdings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Sample Data (Development)
-- ============================================

-- 테스트 사용자
INSERT INTO users (email, name, role)
VALUES ('admin@kss.com', 'Admin', 'admin')
ON CONFLICT (email) DO NOTHING;

-- 테스트 포트폴리오
INSERT INTO portfolios (user_id, name, description, is_default)
SELECT id, 'My Portfolio', 'Default portfolio', true
FROM users
WHERE email = 'admin@kss.com'
ON CONFLICT DO NOTHING;

-- ============================================
-- Comments
-- ============================================

COMMENT ON TABLE portfolios IS '사용자 포트폴리오 목록';
COMMENT ON TABLE holdings IS '포트폴리오 보유 종목';
COMMENT ON TABLE transactions IS '매수/매도 거래 이력';
COMMENT ON TABLE portfolio_alerts IS '포트폴리오 관련 알림 (온톨로지 기반)';
COMMENT ON TABLE portfolio_snapshots IS '일일 포트폴리오 성과 스냅샷';
COMMENT ON TABLE portfolio_risks IS '온톨로지 기반 리스크 분석 결과';

COMMENT ON FUNCTION calculate_portfolio_value IS '포트폴리오 총 평가액 계산';
COMMENT ON FUNCTION calculate_unrealized_profit IS '포트폴리오 미실현 손익 계산';
