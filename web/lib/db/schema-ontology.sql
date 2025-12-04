-- ============================================================================
-- KSS Ontology - Real Triple Store Schema
-- 진짜 온톨로지를 위한 데이터베이스 스키마
-- ============================================================================

-- RDF Triples 테이블 (온톨로지의 핵심)
CREATE TABLE IF NOT EXISTS knowledge_triples (
  id SERIAL PRIMARY KEY,
  subject VARCHAR(200) NOT NULL,  -- URI (예: kss:Company_Samsung)
  predicate VARCHAR(200) NOT NULL, -- URI (예: kss:supplies_to)
  object VARCHAR(200) NOT NULL,   -- URI 또는 리터럴
  confidence FLOAT NOT NULL CHECK (confidence >= 0.0 AND confidence <= 1.0),
  source_url TEXT,                -- 뉴스 출처
  extracted_date TIMESTAMP NOT NULL DEFAULT NOW(),
  validated_by VARCHAR(20) CHECK (validated_by IN ('baseline', 'user', 'gpt')),
  user_feedback INTEGER DEFAULT 0, -- 👍 +1, 👎 -1, neutral 0
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Triple 조회 성능을 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_triples_subject ON knowledge_triples(subject);
CREATE INDEX IF NOT EXISTS idx_triples_predicate ON knowledge_triples(predicate);
CREATE INDEX IF NOT EXISTS idx_triples_object ON knowledge_triples(object);
CREATE INDEX IF NOT EXISTS idx_triples_confidence ON knowledge_triples(confidence DESC);
CREATE INDEX IF NOT EXISTS idx_triples_extracted_date ON knowledge_triples(extracted_date DESC);

-- SPARQL 쿼리를 위한 복합 인덱스
CREATE INDEX IF NOT EXISTS idx_triples_spo ON knowledge_triples(subject, predicate, object);

-- ============================================================================
-- 뉴스 아티클 테이블
-- ============================================================================
CREATE TABLE IF NOT EXISTS news_articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  link TEXT UNIQUE NOT NULL,
  pub_date TIMESTAMP,
  company VARCHAR(100), -- 관련 기업명
  fetched_at TIMESTAMP DEFAULT NOW(),
  processed BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_news_company ON news_articles(company);
CREATE INDEX IF NOT EXISTS idx_news_processed ON news_articles(processed);
CREATE INDEX IF NOT EXISTS idx_news_pub_date ON news_articles(pub_date DESC);

-- ============================================================================
-- 관계 피드백 테이블 (사용자 검증)
-- ============================================================================
CREATE TABLE IF NOT EXISTS relation_feedback (
  id SERIAL PRIMARY KEY,
  triple_id INTEGER REFERENCES knowledge_triples(id) ON DELETE CASCADE,
  user_id INTEGER, -- 나중에 users 테이블과 연결
  feedback VARCHAR(20) CHECK (feedback IN ('correct', 'incorrect', 'uncertain')),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_triple ON relation_feedback(triple_id);

-- ============================================================================
-- 커버 기업 테이블 (운영사 관리)
-- ============================================================================
CREATE TABLE IF NOT EXISTS covered_companies (
  id SERIAL PRIMARY KEY,
  company_uri VARCHAR(200) UNIQUE NOT NULL,
  company_name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  priority INTEGER DEFAULT 0, -- 우선순위 (높을수록 중요)
  added_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_covered_active ON covered_companies(is_active, priority DESC);

-- ============================================================================
-- 일일 인사이트 캐시 테이블
-- ============================================================================
CREATE TABLE IF NOT EXISTS daily_insights (
  id SERIAL PRIMARY KEY,
  insight_date DATE NOT NULL,
  company_uri VARCHAR(200) NOT NULL,
  sentiment VARCHAR(20),
  importance INTEGER,
  summary TEXT,
  key_points JSONB,
  ontology_analysis JSONB, -- 온톨로지 기반 분석 결과
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(insight_date, company_uri)
);

CREATE INDEX IF NOT EXISTS idx_insights_date ON daily_insights(insight_date DESC);
CREATE INDEX IF NOT EXISTS idx_insights_company ON daily_insights(company_uri);

-- ============================================================================
-- 추론 결과 캐시 테이블 (Reasoning Engine)
-- ============================================================================
CREATE TABLE IF NOT EXISTS inferred_relations (
  id SERIAL PRIMARY KEY,
  source_triple_id INTEGER REFERENCES knowledge_triples(id),
  inferred_subject VARCHAR(200) NOT NULL,
  inferred_predicate VARCHAR(200) NOT NULL,
  inferred_object VARCHAR(200) NOT NULL,
  reasoning_rule VARCHAR(50), -- 예: 'transitive', 'inverse', 'symmetric'
  confidence FLOAT,
  inferred_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inferred_subject ON inferred_relations(inferred_subject);

-- ============================================================================
-- 초기 데이터: 커버 기업 목록 (예시)
-- ============================================================================
INSERT INTO covered_companies (company_uri, company_name, priority) VALUES
  ('kss:Company_Samsung', '삼성전자', 100),
  ('kss:Company_SKHynix', 'SK하이닉스', 90),
  ('kss:Company_Hyundai', '현대자동차', 85),
  ('kss:Company_LGChem', 'LG화학', 80),
  ('kss:Company_NAVER', '네이버', 75),
  ('kss:Company_Kakao', '카카오', 70),
  ('kss:Company_Tesla', 'Tesla', 95),
  ('kss:Company_Apple', 'Apple', 90),
  ('kss:Company_NVIDIA', 'NVIDIA', 95)
ON CONFLICT (company_uri) DO NOTHING;

-- ============================================================================
-- 뷰: 고신뢰도 관계만 필터링 (0.7 이상)
-- ============================================================================
CREATE OR REPLACE VIEW high_confidence_triples AS
SELECT * FROM knowledge_triples
WHERE confidence >= 0.7
ORDER BY confidence DESC, extracted_date DESC;

-- ============================================================================
-- 뷰: 기업별 관계 요약
-- ============================================================================
CREATE OR REPLACE VIEW company_relations_summary AS
SELECT
  subject,
  predicate,
  COUNT(*) as relation_count,
  AVG(confidence) as avg_confidence,
  MAX(extracted_date) as latest_update
FROM knowledge_triples
GROUP BY subject, predicate
ORDER BY relation_count DESC;

-- ============================================================================
-- 함수: SPARQL-like 쿼리 (간단한 버전)
-- ============================================================================
CREATE OR REPLACE FUNCTION query_triples(
  p_subject VARCHAR DEFAULT NULL,
  p_predicate VARCHAR DEFAULT NULL,
  p_object VARCHAR DEFAULT NULL,
  min_confidence FLOAT DEFAULT 0.7
)
RETURNS TABLE (
  subject VARCHAR,
  predicate VARCHAR,
  object VARCHAR,
  confidence FLOAT,
  source_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    kt.subject,
    kt.predicate,
    kt.object,
    kt.confidence,
    kt.source_url
  FROM knowledge_triples kt
  WHERE
    (p_subject IS NULL OR kt.subject = p_subject) AND
    (p_predicate IS NULL OR kt.predicate = p_predicate) AND
    (p_object IS NULL OR kt.object = p_object) AND
    kt.confidence >= min_confidence
  ORDER BY kt.confidence DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 예제 쿼리:
-- SELECT * FROM query_triples('kss:Company_Samsung', NULL, NULL, 0.8);
-- SELECT * FROM query_triples(NULL, 'kss:supplies_to', 'kss:Company_Tesla', 0.7);
-- ============================================================================

-- ============================================================================
-- Triple 피드백 이력 테이블 (사용자 액션 로그)
-- ============================================================================
CREATE TABLE IF NOT EXISTS triple_feedback (
  id SERIAL PRIMARY KEY,
  triple_id INTEGER REFERENCES knowledge_triples(id) ON DELETE CASCADE,
  action VARCHAR(20) NOT NULL CHECK (action IN ('approve', 'reject', 'adjust')),
  confidence FLOAT CHECK (confidence >= 0.0 AND confidence <= 1.0),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_triple_feedback_triple_id ON triple_feedback(triple_id);
CREATE INDEX IF NOT EXISTS idx_triple_feedback_created_at ON triple_feedback(created_at DESC);

