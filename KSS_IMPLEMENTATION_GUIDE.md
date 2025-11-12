# kss-ontology 구현 가이드: 기존 프로젝트 코드 재사용

---

## 목차

1. [설정 관리 구현](#1-설정-관리-구현)
2. [데이터베이스 연결 구현](#2-데이터베이스-연결-구현)
3. [인증 시스템 구현](#3-인증-시스템-구현)
4. [자동화 스케줄러 구현](#4-자동화-스케줄러-구현)
5. [AI/LLM 통합](#5-ai-llm-통합)
6. [프론트엔드 UI 구현](#6-프론트엔드-ui-구현)

---

## 1. 설정 관리 구현

### 1.1 파일 구조

```
kss-ontology/
├── src/
│   ├── core/
│   │   ├── config/
│   │   │   ├── __init__.py
│   │   │   ├── settings.py        # 메인 설정 (from itnews-flux)
│   │   │   └── models.py          # 설정 모델
│   │   └── logging/
│   │       └── __init__.py
│   ├── database/
│   └── auth/
├── .env.example
└── requirements.txt
```

### 1.2 Settings 클래스 구현

```python
# src/core/config/settings.py

from enum import Enum
from pathlib import Path
from typing import Optional
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Environment(str, Enum):
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"


class DatabaseSettings(BaseSettings):
    """PostgreSQL 데이터베이스 설정"""
    
    model_config = SettingsConfigDict(env_prefix="DATABASE_", extra="ignore")
    
    url: str = Field(
        "postgresql://user:password@localhost:5432/kss_ontology",
        description="Database connection URL"
    )
    pool_size: int = Field(5, description="Connection pool size")
    max_overflow: int = Field(10, description="Max overflow connections")
    echo: bool = Field(False, description="Log SQL queries")


class Neo4jSettings(BaseSettings):
    """Neo4j 그래프 데이터베이스 설정 (온톨로지용)"""
    
    model_config = SettingsConfigDict(env_prefix="NEO4J_", extra="ignore")
    
    url: str = Field("bolt://localhost:7687", description="Neo4j bolt URL")
    username: str = Field("neo4j", description="Neo4j username")
    password: str = Field(..., description="Neo4j password")
    database: str = Field("neo4j", description="Database name")


class OpenAISettings(BaseSettings):
    """OpenAI API 설정"""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="OPENAI_",
        extra="ignore"
    )
    
    api_key: str = Field(..., description="OpenAI API key")
    org_id: Optional[str] = Field(None, description="Organization ID")
    model: str = Field("gpt-4o", description="Model name")
    embedding_model: str = Field("text-embedding-3-small", description="Embedding model")


class AnthropicSettings(BaseSettings):
    """Anthropic Claude API 설정"""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="ANTHROPIC_",
        extra="ignore"
    )
    
    api_key: Optional[str] = Field(None, description="Anthropic API key")
    model: str = Field("claude-3-opus-20240229", description="Model name")


class SchedulerSettings(BaseSettings):
    """스케줄러 설정"""
    
    model_config = SettingsConfigDict(env_prefix="SCHEDULER_", extra="ignore")
    
    enabled: bool = Field(True, description="Enable scheduler")
    ontology_update_hour: int = Field(2, description="Daily update hour (UTC)")
    ontology_update_minute: int = Field(0, description="Update minute")
    timezone: str = Field("Asia/Seoul", description="Timezone")


class OntologySettings(BaseSettings):
    """온톨로지 특화 설정"""
    
    model_config = SettingsConfigDict(env_prefix="ONTOLOGY_", extra="ignore")
    
    # 온톨로지 생성 설정
    max_concepts: int = Field(1000, description="Maximum concepts per ontology")
    max_relationships: int = Field(5000, description="Maximum relationships")
    min_confidence: float = Field(0.7, description="Minimum confidence score")
    
    # 임베딩 설정
    embedding_dimension: int = Field(1536, description="Embedding dimension")
    vector_similarity_threshold: float = Field(0.8, description="Similarity threshold")
    
    # 레이아웃 설정
    graph_layout: str = Field("force", description="Graph layout algorithm")
    node_size: int = Field(30, description="Default node size")
    edge_weight: float = Field(1.0, description="Default edge weight")


class Settings(BaseSettings):
    """메인 애플리케이션 설정"""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )
    
    # 애플리케이션
    app_env: Environment = Field(Environment.DEVELOPMENT, description="Environment")
    app_debug: bool = Field(True, description="Debug mode")
    app_name: str = Field("KSS Ontology", description="Application name")
    app_version: str = Field("0.1.0", description="Version")
    app_port: int = Field(8000, description="Port")
    
    # 로깅
    log_level: str = Field("INFO", description="Log level")
    log_file: Path = Field(Path("logs/app.log"), description="Log file path")
    
    # 보안
    secret_key: str = Field(..., description="Secret key for JWT")
    jwt_algorithm: str = Field("HS256", description="JWT algorithm")
    jwt_expiration_hours: int = Field(24, description="JWT expiration hours")
    
    # 중첩 설정
    database: DatabaseSettings = Field(default_factory=DatabaseSettings)
    neo4j: Neo4jSettings = Field(default_factory=Neo4jSettings)
    openai: OpenAISettings = Field(default_factory=OpenAISettings)
    anthropic: AnthropicSettings = Field(default_factory=AnthropicSettings)
    scheduler: SchedulerSettings = Field(default_factory=SchedulerSettings)
    ontology: OntologySettings = Field(default_factory=OntologySettings)
    
    @property
    def is_development(self) -> bool:
        return self.app_env == Environment.DEVELOPMENT
    
    @property
    def is_production(self) -> bool:
        return self.app_env == Environment.PRODUCTION
    
    def model_dump_safe(self) -> dict:
        """민감 정보 제거된 설정 반환"""
        data = self.model_dump()
        
        # 민감 정보 마스킹
        for key in data:
            if isinstance(data[key], dict):
                for subkey in data[key]:
                    if any(s in subkey.lower() for s in ["key", "password", "secret"]):
                        data[key][subkey] = "***REDACTED***"
        
        return data


# 전역 설정 인스턴스
_settings: Optional[Settings] = None


def get_settings() -> Settings:
    """설정 인스턴스 반환"""
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings


def reload_settings() -> Settings:
    """설정 재로드"""
    global _settings
    _settings = Settings()
    return _settings
```

### 1.3 .env.example

```env
# 애플리케이션
APP_ENV=development
APP_DEBUG=true
APP_NAME=KSS Ontology
APP_PORT=8000

# 로깅
LOG_LEVEL=INFO

# 보안
SECRET_KEY=your-secret-key-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/kss_ontology
DATABASE_POOL_SIZE=5
DATABASE_MAX_OVERFLOW=10

# Neo4j (온톨로지 그래프 DB)
NEO4J_URL=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=password
NEO4J_DATABASE=neo4j

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_ORG_ID=org-...
OPENAI_MODEL=gpt-4o
OPENAI_EMBEDDING_MODEL=text-embedding-3-small

# Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-opus-20240229

# 스케줄러
SCHEDULER_ENABLED=true
SCHEDULER_ONTOLOGY_UPDATE_HOUR=2
SCHEDULER_ONTOLOGY_UPDATE_MINUTE=0
SCHEDULER_TIMEZONE=Asia/Seoul

# 온톨로지
ONTOLOGY_MAX_CONCEPTS=1000
ONTOLOGY_MAX_RELATIONSHIPS=5000
ONTOLOGY_MIN_CONFIDENCE=0.7
ONTOLOGY_EMBEDDING_DIMENSION=1536
ONTOLOGY_VECTOR_SIMILARITY_THRESHOLD=0.8
ONTOLOGY_GRAPH_LAYOUT=force
```

---

## 2. 데이터베이스 연결 구현

### 2.1 PostgreSQL 연결 (odin-ai 방식)

```python
# src/database/__init__.py

import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager
import logging
from .models import Base

logger = logging.getLogger(__name__)


@contextmanager
def get_db_connection(database_url: str):
    """데이터베이스 연결 컨텍스트 매니저"""
    conn = None
    try:
        conn = psycopg2.connect(database_url)
        yield conn
    except Exception as e:
        if conn:
            conn.rollback()
        logger.error(f"Database error: {e}")
        raise
    finally:
        if conn:
            conn.close()


def get_db():
    """FastAPI 의존성 주입"""
    from src.core.config import get_settings
    settings = get_settings()
    
    conn = psycopg2.connect(settings.database.url)
    try:
        yield conn
    finally:
        conn.close()
```

### 2.2 Neo4j 그래프 데이터베이스 연결

```python
# src/database/neo4j.py

from neo4j import GraphDatabase
from contextlib import contextmanager
import logging

logger = logging.getLogger(__name__)


class Neo4jConnection:
    """Neo4j 연결 관리"""
    
    def __init__(self, uri: str, username: str, password: str, database: str = "neo4j"):
        self.uri = uri
        self.username = username
        self.password = password
        self.database = database
        self.driver = None
    
    def connect(self):
        """연결 생성"""
        try:
            self.driver = GraphDatabase.driver(
                self.uri,
                auth=(self.username, self.password)
            )
            logger.info(f"Connected to Neo4j: {self.uri}")
        except Exception as e:
            logger.error(f"Failed to connect to Neo4j: {e}")
            raise
    
    def disconnect(self):
        """연결 종료"""
        if self.driver:
            self.driver.close()
            logger.info("Disconnected from Neo4j")
    
    @contextmanager
    def session(self):
        """Neo4j 세션 컨텍스트 매니저"""
        session = self.driver.session(database=self.database)
        try:
            yield session
        finally:
            session.close()
    
    def query(self, cypher: str, parameters: dict = None):
        """Cypher 쿼리 실행"""
        with self.session() as session:
            result = session.run(cypher, parameters or {})
            return [record for record in result]


# 전역 Neo4j 인스턴스
_neo4j: Neo4jConnection = None


def get_neo4j() -> Neo4jConnection:
    """Neo4j 인스턴스 반환"""
    global _neo4j
    if _neo4j is None:
        from src.core.config import get_settings
        settings = get_settings()
        
        _neo4j = Neo4jConnection(
            uri=settings.neo4j.url,
            username=settings.neo4j.username,
            password=settings.neo4j.password,
            database=settings.neo4j.database
        )
        _neo4j.connect()
    
    return _neo4j
```

### 2.3 데이터베이스 마이그레이션 (Alembic)

```bash
# alembic 초기화
alembic init alembic

# 마이그레이션 생성
alembic revision --autogenerate -m "Create users table"

# 마이그레이션 적용
alembic upgrade head
```

---

## 3. 인증 시스템 구현

### 3.1 보안 유틸리티 (odin-ai 방식)

```python
# src/auth/security.py

from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
import os

# 환경변수에서 설정
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", 24))

# bcrypt 컨텍스트
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """비밀번호 검증"""
    try:
        # bcrypt는 72바이트 제한
        if len(plain_password.encode('utf-8')) > 72:
            plain_password = plain_password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f"Password verification error: {e}")
        return False


def get_password_hash(password: str) -> str:
    """비밀번호 해시 생성"""
    if len(password.encode('utf-8')) > 72:
        password = password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """액세스 토큰 생성"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def create_refresh_token(data: dict) -> str:
    """리프레시 토큰 생성"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> dict:
    """토큰 디코드"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
```

### 3.2 인증 의존성

```python
# src/auth/dependencies.py

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from pydantic import BaseModel
from src.auth.security import decode_token
from src.database import get_db_connection
from src.core.config import get_settings

bearer_scheme = HTTPBearer(auto_error=False)


class User(BaseModel):
    """사용자 모델"""
    id: int
    email: str
    username: str
    full_name: Optional[str] = None
    role: str  # admin, editor, viewer
    is_active: bool = True
    email_verified: bool = False


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)
) -> User:
    """현재 사용자 조회"""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        # 토큰 디코드
        payload = decode_token(credentials.credentials)
        if not payload or payload.get("type") != "access":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        # 데이터베이스에서 사용자 조회
        settings = get_settings()
        from src.database import get_db_connection
        
        with get_db_connection(settings.database.url) as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT id, email, username, full_name, role, is_active, email_verified "
                "FROM users WHERE id = %s AND is_active = true",
                (user_id,)
            )
            user_data = cursor.fetchone()
        
        if not user_data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        return User(
            id=user_data[0],
            email=user_data[1],
            username=user_data[2],
            full_name=user_data[3],
            role=user_data[4],
            is_active=user_data[5],
            email_verified=user_data[6]
        )
    
    except HTTPException:
        raise
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f"Authentication error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )


async def get_current_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    """관리자 권한 확인"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin role required"
        )
    return current_user


async def get_current_editor(
    current_user: User = Depends(get_current_user)
) -> User:
    """편집자 이상 권한 확인"""
    if current_user.role not in ["admin", "editor"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Editor role required"
        )
    return current_user
```

---

## 4. 자동화 스케줄러 구현

### 4.1 스케줄러 구현 (itnews-flux 방식)

```python
# src/automation/scheduler.py

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from datetime import datetime
import logging
from typing import Callable, Optional
import pytz

logger = logging.getLogger(__name__)


class OntologyScheduler:
    """온톨로지 자동 업데이트 스케줄러"""
    
    def __init__(
        self,
        hour: int = 2,
        minute: int = 0,
        timezone: str = "Asia/Seoul"
    ):
        self.scheduler = BackgroundScheduler()
        self.hour = hour
        self.minute = minute
        self.timezone = pytz.timezone(timezone)
        self.is_running = False
    
    def add_job(
        self,
        func: Callable,
        job_id: str,
        hour: Optional[int] = None,
        minute: Optional[int] = None
    ):
        """정시 작업 추가"""
        if hour is None:
            hour = self.hour
        if minute is None:
            minute = self.minute
        
        trigger = CronTrigger(
            hour=hour,
            minute=minute,
            timezone=self.timezone
        )
        
        self.scheduler.add_job(
            func,
            trigger=trigger,
            id=job_id,
            name=job_id,
            replace_existing=True,
            misfire_grace_time=300  # 5분 내 놓친 작업 실행
        )
        
        logger.info(f"Job '{job_id}' scheduled for {hour:02d}:{minute:02d} {self.timezone}")
    
    def add_immediate_job(self, func: Callable, job_id: str):
        """즉시 실행 작업"""
        self.scheduler.add_job(
            func,
            id=job_id,
            name=job_id,
            replace_existing=True
        )
        logger.info(f"Job '{job_id}' scheduled for immediate execution")
    
    def start(self):
        """스케줄러 시작"""
        if not self.is_running:
            self.scheduler.start()
            self.is_running = True
            logger.info(f"Scheduler started (timezone: {self.timezone})")
    
    def stop(self):
        """스케줄러 중지"""
        if self.is_running:
            self.scheduler.shutdown(wait=True)
            self.is_running = False
            logger.info("Scheduler stopped")
    
    def get_jobs(self):
        """등록된 작업 목록 반환"""
        return self.scheduler.get_jobs()
    
    def pause_job(self, job_id: str):
        """작업 일시 중지"""
        self.scheduler.pause_job(job_id)
        logger.info(f"Job '{job_id}' paused")
    
    def resume_job(self, job_id: str):
        """작업 재개"""
        self.scheduler.resume_job(job_id)
        logger.info(f"Job '{job_id}' resumed")


# 전역 스케줄러 인스턴스
_scheduler: Optional[OntologyScheduler] = None


def get_scheduler() -> OntologyScheduler:
    """스케줄러 인스턴스 반환"""
    global _scheduler
    if _scheduler is None:
        from src.core.config import get_settings
        settings = get_settings()
        
        _scheduler = OntologyScheduler(
            hour=settings.scheduler.ontology_update_hour,
            minute=settings.scheduler.ontology_update_minute,
            timezone=settings.scheduler.timezone
        )
    
    return _scheduler
```

### 4.2 온톨로지 업데이트 파이프라인

```python
# src/automation/ontology_pipeline.py

import logging
from datetime import datetime
from typing import Dict, List, Any
from src.services.ontology import OntologyService
from src.services.ai import AIService
from src.database.neo4j import get_neo4j

logger = logging.getLogger(__name__)


class OntologyUpdatePipeline:
    """온톨로지 자동 업데이트 파이프라인"""
    
    def __init__(self):
        self.ontology_service = OntologyService()
        self.ai_service = AIService()
        self.neo4j = get_neo4j()
    
    def fetch_updates(self) -> List[Dict[str, Any]]:
        """새로운 개념 및 관계 수집"""
        logger.info("Fetching ontology updates...")
        
        # AI 기반 온톨로지 확장
        updates = self.ai_service.suggest_ontology_updates()
        
        logger.info(f"Found {len(updates)} potential updates")
        return updates
    
    def validate_updates(self, updates: List[Dict]) -> List[Dict]:
        """업데이트 검증"""
        logger.info("Validating updates...")
        
        validated = []
        for update in updates:
            if self.ontology_service.validate(update):
                validated.append(update)
        
        logger.info(f"Validated {len(validated)} updates")
        return validated
    
    def apply_updates(self, updates: List[Dict]) -> bool:
        """업데이트 적용"""
        logger.info("Applying updates to Neo4j...")
        
        try:
            with self.neo4j.session() as session:
                for update in updates:
                    # 개념 추가
                    if update.get("concept"):
                        cypher = """
                        MERGE (n:Concept {id: $id})
                        SET n.name = $name,
                            n.description = $description,
                            n.confidence = $confidence,
                            n.updated_at = timestamp()
                        """
                        session.run(cypher, update["concept"])
                    
                    # 관계 추가
                    if update.get("relationship"):
                        cypher = """
                        MATCH (a:Concept {id: $from}), (b:Concept {id: $to})
                        MERGE (a)-[r:{rel_type}]->(b)
                        SET r.confidence = $confidence,
                            r.updated_at = timestamp()
                        """.format(rel_type=update["relationship"]["type"])
                        
                        session.run(cypher, update["relationship"])
            
            logger.info(f"Successfully applied {len(updates)} updates")
            return True
        
        except Exception as e:
            logger.error(f"Failed to apply updates: {e}")
            return False
    
    def run(self) -> Dict[str, Any]:
        """파이프라인 실행"""
        start_time = datetime.utcnow()
        
        try:
            # 1. 업데이트 수집
            updates = self.fetch_updates()
            
            # 2. 검증
            validated_updates = self.validate_updates(updates)
            
            # 3. 적용
            success = self.apply_updates(validated_updates)
            
            elapsed_time = (datetime.utcnow() - start_time).total_seconds()
            
            return {
                "success": success,
                "timestamp": start_time.isoformat(),
                "updates_found": len(updates),
                "updates_validated": len(validated_updates),
                "updates_applied": len(validated_updates) if success else 0,
                "elapsed_seconds": elapsed_time
            }
        
        except Exception as e:
            logger.error(f"Pipeline error: {e}", exc_info=True)
            return {
                "success": False,
                "error": str(e),
                "timestamp": start_time.isoformat()
            }
```

---

## 5. AI/LLM 통합

### 5.1 OpenAI 통합

```python
# src/services/ai/openai_service.py

import openai
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class OpenAIService:
    """OpenAI API 서비스"""
    
    def __init__(self, api_key: str, model: str = "gpt-4o"):
        openai.api_key = api_key
        self.model = model
    
    def generate_concept_description(
        self,
        concept_name: str,
        context: str
    ) -> str:
        """개념 설명 생성"""
        try:
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert in ontology design. Generate clear, concise descriptions."
                    },
                    {
                        "role": "user",
                        "content": f"Generate a description for the concept '{concept_name}' in context of: {context}"
                    }
                ],
                temperature=0.7,
                max_tokens=200
            )
            
            return response.choices[0].message.content
        
        except Exception as e:
            logger.error(f"Failed to generate description: {e}")
            return ""
    
    def suggest_relationships(
        self,
        concept_a: str,
        concept_b: str
    ) -> Optional[Dict]:
        """개념 간 관계 제안"""
        try:
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an ontology expert. Suggest relationships between concepts."
                    },
                    {
                        "role": "user",
                        "content": f"What is the relationship between '{concept_a}' and '{concept_b}'? "
                                  "Respond with: type, confidence (0-1), and description"
                    }
                ],
                temperature=0.5,
                max_tokens=150
            )
            
            # Parse response (implement parsing logic)
            return {"type": "related_to", "confidence": 0.8}
        
        except Exception as e:
            logger.error(f"Failed to suggest relationships: {e}")
            return None
    
    def generate_embedding(self, text: str) -> List[float]:
        """텍스트 임베딩 생성"""
        try:
            from src.core.config import get_settings
            settings = get_settings()
            
            response = openai.Embedding.create(
                input=text,
                model=settings.openai.embedding_model
            )
            
            return response['data'][0]['embedding']
        
        except Exception as e:
            logger.error(f"Failed to generate embedding: {e}")
            return []
```

### 5.2 Claude API 통합 (RAG)

```python
# src/services/ai/claude_service.py

import anthropic
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class ClaudeService:
    """Anthropic Claude 서비스 (RAG용)"""
    
    def __init__(self, api_key: str, model: str = "claude-3-opus-20240229"):
        self.client = anthropic.Anthropic(api_key=api_key)
        self.model = model
    
    def analyze_ontology(self, ontology_data: str) -> str:
        """온톨로지 데이터 분석"""
        try:
            message = self.client.messages.create(
                model=self.model,
                max_tokens=2048,
                messages=[
                    {
                        "role": "user",
                        "content": f"Analyze this ontology structure and suggest improvements:\n\n{ontology_data}"
                    }
                ]
            )
            
            return message.content[0].text
        
        except Exception as e:
            logger.error(f"Failed to analyze ontology: {e}")
            return ""
    
    def answer_ontology_question(self, question: str, context: str = "") -> str:
        """온톨로지 관련 질문 답변"""
        try:
            content = f"{context}\n\nQuestion: {question}"
            
            message = self.client.messages.create(
                model=self.model,
                max_tokens=1024,
                messages=[
                    {
                        "role": "user",
                        "content": content
                    }
                ]
            )
            
            return message.content[0].text
        
        except Exception as e:
            logger.error(f"Failed to answer question: {e}")
            return ""
```

---

## 6. 프론트엔드 UI 구현

### 6.1 대시보드 컴포넌트

```typescript
// frontend/src/pages/Dashboard.tsx

import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import apiClient from '../services/api';

const Dashboard: React.FC = () => {
  // 온톨로지 통계 조회
  const { data: stats, isLoading } = useQuery({
    queryKey: ['ontologyStats'],
    queryFn: () => apiClient.getOntologyStats(),
    refetchInterval: 300000, // 5분 갱신
  });

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Ontology Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* 통계 카드 */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Concepts
              </Typography>
              <Typography variant="h5">
                {stats?.total_concepts || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 차트 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Concepts Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats?.history || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
```

### 6.2 API 클라이언트

```typescript
// frontend/src/services/api.ts

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰 인터셉터
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const ontologyAPI = {
  getStats: () => apiClient.get('/ontology/stats'),
  getConcepts: (limit?: number) =>
    apiClient.get('/ontology/concepts', { params: { limit } }),
  createConcept: (data: any) => apiClient.post('/ontology/concepts', data),
  updateOntology: () => apiClient.post('/ontology/update'),
};

export default ontologyAPI;
```

---

## 구현 우선순위

### Phase 1 (1주) - 기초 구축
1. [ ] 설정 관리 (Pydantic Settings)
2. [ ] PostgreSQL + Neo4j 연결
3. [ ] 기본 인증 시스템

### Phase 2 (1주) - 자동화
4. [ ] APScheduler 통합
5. [ ] 온톨로지 업데이트 파이프라인
6. [ ] AI 통합 (OpenAI + Claude)

### Phase 3 (1주) - UI
7. [ ] 대시보드 구현
8. [ ] API 클라이언트
9. [ ] 그래프 시각화

### Phase 4 (1주) - 테스트 및 배포
10. [ ] 통합 테스트
11. [ ] 성능 최적화
12. [ ] 프로덕션 배포

---

**예상 개발 기간**: 4주  
**필요 인원**: 2명 (백엔드 1, 프론트엔드 1)  
**기존 프로젝트 코드 재사용율**: 60-70%

