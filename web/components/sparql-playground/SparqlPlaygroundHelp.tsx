'use client';

import React from 'react';
import { HelpModal, HelpSection, TipBox } from '@/components/common/HelpModal';
import {
  Search,
  Code2,
  PlayCircle,
  Database,
  Table,
  AlertCircle
} from 'lucide-react';

interface SparqlPlaygroundHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SparqlPlaygroundHelp: React.FC<SparqlPlaygroundHelpProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <HelpModal
      isOpen={isOpen}
      onClose={onClose}
      title="SPARQL 플레이그라운드 사용 가이드"
    >
      <HelpSection icon={<Code2 className="w-5 h-5 text-blue-500" />} title="1. SPARQL이란?">
        <p>SPARQL은 RDF 데이터를 검색하기 위한 질의 언어입니다. SQL과 비슷하지만 그래프 데이터에 특화되어 있습니다.</p>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <h4 className="font-semibold mb-2">기본 구조:</h4>
          <pre className="text-sm font-mono">{`PREFIX : <http://example.org/>

SELECT ?변수1 ?변수2
WHERE {
  트리플 패턴
}`}</pre>
        </div>

        <TipBox>
          SPARQL은 패턴 매칭을 통해 작동합니다. WHERE 절에 작성한 패턴과 일치하는 데이터를 찾아 반환합니다.
        </TipBox>
      </HelpSection>

      <HelpSection icon={<Search className="w-5 h-5 text-green-500" />} title="2. 기본 쿼리 작성법">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">모든 트리플 조회:</h4>
            <pre className="bg-gray-50 dark:bg-gray-900 rounded p-3 text-sm font-mono">{`SELECT ?s ?p ?o
WHERE {
  ?s ?p ?o .
}`}</pre>
            <p className="text-sm mt-2">모든 주어(?s), 서술어(?p), 목적어(?o)를 반환합니다.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">특정 주어의 정보 조회:</h4>
            <pre className="bg-gray-50 dark:bg-gray-900 rounded p-3 text-sm font-mono">{`SELECT ?property ?value
WHERE {
  :김철수 ?property ?value .
}`}</pre>
            <p className="text-sm mt-2">김철수에 대한 모든 속성과 값을 조회합니다.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">특정 속성 검색:</h4>
            <pre className="bg-gray-50 dark:bg-gray-900 rounded p-3 text-sm font-mono">{`SELECT ?person ?name
WHERE {
  ?person :hasName ?name .
}`}</pre>
            <p className="text-sm mt-2">이름을 가진 모든 사람을 찾습니다.</p>
          </div>
        </div>
      </HelpSection>

      <HelpSection icon={<Database className="w-5 h-5 text-purple-500" />} title="3. 패턴 매칭">
        <p>여러 패턴을 조합하여 복잡한 질의를 만들 수 있습니다.</p>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <h4 className="font-semibold mb-2">다중 패턴 (AND 조건):</h4>
          <pre className="text-sm font-mono">{`SELECT ?person ?name ?age
WHERE {
  ?person :type :Person .
  ?person :hasName ?name .
  ?person :hasAge ?age .
}`}</pre>
          <p className="text-sm mt-2">Person 타입이며, 이름과 나이를 모두 가진 개체를 찾습니다.</p>
        </div>

        <div className="mt-4 space-y-2">
          <h4 className="font-semibold">패턴 매칭 규칙:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>?변수</strong>: 어떤 값이든 매치 (결과로 반환)</li>
            <li><strong>:상수</strong>: 정확히 일치하는 값만 매치</li>
            <li><strong>같은 변수</strong>: 같은 값으로 바인딩</li>
            <li><strong>마침표(.)</strong>: 패턴 구분자</li>
          </ul>
        </div>
      </HelpSection>

      <HelpSection icon={<Table className="w-5 h-5 text-orange-500" />} title="4. 결과 읽기">
        <p>쿼리 결과는 테이블 형태로 표시됩니다.</p>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-blue-500 rounded"></span>
            <span className="text-sm">파란색: 리소스 (개체 참조)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-orange-500 rounded"></span>
            <span className="text-sm">주황색: 리터럴 (실제 값)</span>
          </div>
        </div>

        <TipBox>
          결과가 없다면 패턴이 데이터와 일치하지 않는 것입니다.
          변수명이나 속성명을 확인해보세요.
        </TipBox>
      </HelpSection>

      <HelpSection icon={<PlayCircle className="w-5 h-5 text-red-500" />} title="5. 실습 예제">
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="font-semibold mb-2">예제 1: 회사 직원 찾기</h4>
            <pre className="text-sm font-mono mb-2">{`SELECT ?person ?name
WHERE {
  ?person :worksAt :회사A .
  ?person :hasName ?name .
}`}</pre>
            <p className="text-sm">회사A에서 일하는 모든 사람의 이름을 찾습니다.</p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <h4 className="font-semibold mb-2">예제 2: 나이로 검색</h4>
            <pre className="text-sm font-mono mb-2">{`SELECT ?person ?age
WHERE {
  ?person :hasAge ?age .
}`}</pre>
            <p className="text-sm">나이 정보가 있는 모든 사람을 찾습니다.</p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <h4 className="font-semibold mb-2">예제 3: 타입별 분류</h4>
            <pre className="text-sm font-mono mb-2">{`SELECT ?entity ?type
WHERE {
  ?entity :type ?type .
}`}</pre>
            <p className="text-sm">모든 개체와 그 타입을 조회합니다.</p>
          </div>
        </div>
      </HelpSection>

      <HelpSection icon={<AlertCircle className="w-5 h-5 text-yellow-500" />} title="6. 주의사항">
        <ul className="list-disc list-inside space-y-2">
          <li>대소문자를 구분합니다 (Person != person)</li>
          <li>변수는 반드시 ?나 $로 시작해야 합니다</li>
          <li>패턴 끝에는 마침표(.)를 붙입니다</li>
          <li>PREFIX 선언이 있다면 반드시 맨 위에 작성합니다</li>
          <li>현재는 SELECT 쿼리만 지원됩니다</li>
        </ul>

        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-sm">
            <strong>Tip:</strong> 먼저 간단한 패턴으로 시작한 후,
            점진적으로 조건을 추가하며 원하는 결과를 얻어가세요.
          </p>
        </div>
      </HelpSection>

      <HelpSection title="7. 단축키">
        <ul className="list-disc list-inside space-y-1">
          <li><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm">Ctrl</kbd> + <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm">Enter</kbd> : 쿼리 실행</li>
        </ul>
      </HelpSection>
    </HelpModal>
  );
};
