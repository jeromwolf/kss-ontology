// Sample RDF Triple data for demonstration purposes
export const sampleTriples = {
  basic: {
    name: '기본 온톨로지',
    description: '사람과 조직에 대한 간단한 온톨로지',
    data: [
      { subject: '사람', predicate: 'rdf:type', object: 'owl:Class', type: 'resource' as const },
      { subject: '조직', predicate: 'rdf:type', object: 'owl:Class', type: 'resource' as const },
      { subject: '직원', predicate: 'rdfs:subClassOf', object: '사람', type: 'resource' as const },
      { subject: '회사', predicate: 'rdfs:subClassOf', object: '조직', type: 'resource' as const },
      { subject: '근무하다', predicate: 'rdf:type', object: 'owl:ObjectProperty', type: 'resource' as const },
      { subject: '근무하다', predicate: 'rdfs:domain', object: '직원', type: 'resource' as const },
      { subject: '근무하다', predicate: 'rdfs:range', object: '회사', type: 'resource' as const },
      { subject: '김철수', predicate: 'rdf:type', object: '직원', type: 'resource' as const },
      { subject: '김철수', predicate: '근무하다', object: '삼성전자', type: 'resource' as const },
      { subject: '삼성전자', predicate: 'rdf:type', object: '회사', type: 'resource' as const },
    ]
  },
  foaf: {
    name: '친구 관계 (FOAF)',
    description: '소셜 네트워크와 사람 관계를 표현하는 온톨로지',
    data: [
      { subject: '김영희', predicate: 'rdf:type', object: 'foaf:Person', type: 'resource' as const },
      { subject: '김영희', predicate: '이름', object: '김영희', type: 'literal' as const },
      { subject: '김영희', predicate: '나이', object: '28', type: 'literal' as const },
      { subject: '김영희', predicate: '친구이다', object: '이철수', type: 'resource' as const },
      { subject: '이철수', predicate: 'rdf:type', object: 'foaf:Person', type: 'resource' as const },
      { subject: '이철수', predicate: '이름', object: '이철수', type: 'literal' as const },
      { subject: '이철수', predicate: '친구이다', object: '박민수', type: 'resource' as const },
      { subject: '박민수', predicate: 'rdf:type', object: 'foaf:Person', type: 'resource' as const },
      { subject: '박민수', predicate: '이름', object: '박민수', type: 'literal' as const },
      { subject: '박민수', predicate: '홈페이지', object: 'http://minsu.blog.com', type: 'literal' as const },
    ]
  },
  academic: {
    name: '학술 도메인',
    description: '대학, 교수, 학생, 강좌 관계를 표현하는 온톨로지',
    data: [
      { subject: '대학', predicate: 'rdf:type', object: 'owl:Class', type: 'resource' as const },
      { subject: '교수', predicate: 'rdf:type', object: 'owl:Class', type: 'resource' as const },
      { subject: '학생', predicate: 'rdf:type', object: 'owl:Class', type: 'resource' as const },
      { subject: '강의', predicate: 'rdf:type', object: 'owl:Class', type: 'resource' as const },
      { subject: '가르치다', predicate: 'rdf:type', object: 'owl:ObjectProperty', type: 'resource' as const },
      { subject: '수강하다', predicate: 'rdf:type', object: 'owl:ObjectProperty', type: 'resource' as const },
      { subject: '김교수', predicate: 'rdf:type', object: '교수', type: 'resource' as const },
      { subject: '김교수', predicate: '가르치다', object: '온톨로지개론', type: 'resource' as const },
      { subject: '온톨로지개론', predicate: 'rdf:type', object: '강의', type: 'resource' as const },
      { subject: '온톨로지개론', predicate: '학점', object: '3', type: 'literal' as const },
      { subject: '이학생', predicate: 'rdf:type', object: '학생', type: 'resource' as const },
      { subject: '이학생', predicate: '수강하다', object: '온톨로지개론', type: 'resource' as const },
    ]
  },
  ecommerce: {
    name: '전자상거래',
    description: '상품, 고객, 주문 관계를 표현하는 온톨로지',
    data: [
      { subject: '상품', predicate: 'rdf:type', object: 'owl:Class', type: 'resource' as const },
      { subject: '고객', predicate: 'rdf:type', object: 'owl:Class', type: 'resource' as const },
      { subject: '주문', predicate: 'rdf:type', object: 'owl:Class', type: 'resource' as const },
      { subject: '가격', predicate: 'rdf:type', object: 'owl:DatatypeProperty', type: 'resource' as const },
      { subject: '주문자', predicate: 'rdf:type', object: 'owl:ObjectProperty', type: 'resource' as const },
      { subject: '포함하다', predicate: 'rdf:type', object: 'owl:ObjectProperty', type: 'resource' as const },
      { subject: '갤럭시북프로', predicate: 'rdf:type', object: '상품', type: 'resource' as const },
      { subject: '갤럭시북프로', predicate: '가격', object: '1200000', type: 'literal' as const },
      { subject: '갤럭시북프로', predicate: '상품명', object: '삼성 갤럭시북 프로', type: 'literal' as const },
      { subject: '홍길동고객', predicate: 'rdf:type', object: '고객', type: 'resource' as const },
      { subject: '주문번호5678', predicate: 'rdf:type', object: '주문', type: 'resource' as const },
      { subject: '주문번호5678', predicate: '주문자', object: '홍길동고객', type: 'resource' as const },
      { subject: '주문번호5678', predicate: '포함하다', object: '갤럭시북프로', type: 'resource' as const },
    ]
  },
  semantic: {
    name: '동물 분류 체계',
    description: '동물 계층 구조와 속성을 보여주는 예제',
    data: [
      { subject: '동물', predicate: 'rdf:type', object: 'owl:Class', type: 'resource' as const },
      { subject: '포유류', predicate: 'rdf:type', object: 'owl:Class', type: 'resource' as const },
      { subject: '포유류', predicate: 'rdfs:subClassOf', object: '동물', type: 'resource' as const },
      { subject: '개', predicate: 'rdf:type', object: 'owl:Class', type: 'resource' as const },
      { subject: '개', predicate: 'rdfs:subClassOf', object: '포유류', type: 'resource' as const },
      { subject: '고양이', predicate: 'rdf:type', object: 'owl:Class', type: 'resource' as const },
      { subject: '고양이', predicate: 'rdfs:subClassOf', object: '포유류', type: 'resource' as const },
      { subject: '애완동물', predicate: 'rdf:type', object: 'owl:ObjectProperty', type: 'resource' as const },
      { subject: '애완동물', predicate: 'rdfs:domain', object: '사람', type: 'resource' as const },
      { subject: '애완동물', predicate: 'rdfs:range', object: '동물', type: 'resource' as const },
      { subject: '나이', predicate: 'rdf:type', object: 'owl:DatatypeProperty', type: 'resource' as const },
      { subject: '바둑이', predicate: 'rdf:type', object: '개', type: 'resource' as const },
      { subject: '바둑이', predicate: '나이', object: '5', type: 'literal' as const },
    ]
  },
  aceworks: {
    name: 'ACEWORKS 비즈니스 생태계',
    description: '박승범 대표이사의 ACEWORKS AI 비즈니스 관계도',
    data: [
      // 조직과 인물
      { subject: '박승범', predicate: 'rdf:type', object: 'foaf:Person', type: 'resource' as const },
      { subject: '박승범', predicate: '직책', object: '대표이사', type: 'literal' as const },
      { subject: '박승범', predicate: '이끌다', object: 'ACEWORKS', type: 'resource' as const },
      { subject: 'ACEWORKS', predicate: 'rdf:type', object: '회사', type: 'resource' as const },
      { subject: 'ACEWORKS', predicate: '설립년도', object: '2019', type: 'literal' as const },
      { subject: 'ACEWORKS', predicate: '분야', object: 'AI콘텐츠생성기술', type: 'literal' as const },
      
      // 제품 관계
      { subject: 'ACEWORKS', predicate: '개발하다', object: 'My-Ruby-Play', type: 'resource' as const },
      { subject: 'My-Ruby-Play', predicate: 'rdf:type', object: 'AI제품', type: 'resource' as const },
      { subject: 'My-Ruby-Play', predicate: '카테고리', object: 'AI스마트토이', type: 'literal' as const },
      { subject: 'My-Ruby-Play', predicate: '사용기술', object: 'GPT4', type: 'resource' as const },
      { subject: 'My-Ruby-Play', predicate: '가격', object: '9만원대', type: 'literal' as const },
      { subject: 'My-Ruby-Play', predicate: '타겟시장', object: '영유아교육', type: 'literal' as const },
      
      { subject: 'ACEWORKS', predicate: '개발하다', object: 'AIQuant', type: 'resource' as const },
      { subject: 'AIQuant', predicate: 'rdf:type', object: 'AI서비스', type: 'resource' as const },
      { subject: 'AIQuant', predicate: '제공서비스', object: 'AI자산관리', type: 'literal' as const },
      { subject: 'AIQuant', predicate: '운용규모', object: '일2000억원', type: 'literal' as const },
      
      { subject: 'ACEWORKS', predicate: '개발하다', object: 'AITuberStudio', type: 'resource' as const },
      { subject: 'AITuberStudio', predicate: 'rdf:type', object: 'AI서비스', type: 'resource' as const },
      { subject: 'AITuberStudio', predicate: '기능', object: 'AI버튜버생성', type: 'literal' as const },
      
      // 파트너십
      { subject: 'SK텔레콤', predicate: 'rdf:type', object: '대기업', type: 'resource' as const },
      { subject: 'SK텔레콤', predicate: '투자하다', object: 'ACEWORKS', type: 'resource' as const },
      { subject: 'SK텔레콤', predicate: '협력분야', object: 'AI기술개발', type: 'literal' as const },
      
      { subject: '한화시스템', predicate: 'rdf:type', object: '대기업', type: 'resource' as const },
      { subject: '한화시스템', predicate: '협력하다', object: 'ACEWORKS', type: 'resource' as const },
      { subject: '한화시스템', predicate: '협력분야', object: '방산AI', type: 'literal' as const },
      
      // 수익과 성과
      { subject: 'ACEWORKS', predicate: '월매출', object: '3-5억원', type: 'literal' as const },
      { subject: 'ACEWORKS', predicate: '누적고객수', object: '10만명이상', type: 'literal' as const },
      { subject: 'ACEWORKS', predicate: '사업모델', object: 'B2B/B2C하이브리드', type: 'literal' as const },
      
      // 기술 스택
      { subject: 'ACEWORKS', predicate: '핵심기술', object: 'PersonalMemory', type: 'resource' as const },
      { subject: 'PersonalMemory', predicate: 'rdf:type', object: 'AI기술', type: 'resource' as const },
      { subject: 'PersonalMemory', predicate: '기능', object: '개인화AI메모리', type: 'literal' as const },
      
      { subject: 'ACEWORKS', predicate: '활용하다', object: 'RAG', type: 'resource' as const },
      { subject: 'RAG', predicate: 'rdf:type', object: 'AI기술', type: 'resource' as const },
      { subject: 'RAG', predicate: '용도', object: '지식증강생성', type: 'literal' as const }
    ]
  }
};

export type SampleTripleKey = keyof typeof sampleTriples;