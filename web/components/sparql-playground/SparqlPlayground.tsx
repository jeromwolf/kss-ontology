'use client';

import React, { useState, useEffect } from 'react';
import { QueryEditor } from './components/QueryEditor';
import { ResultsView } from './components/ResultsView';
import { useSparqlQuery } from './hooks/useSparqlQuery';
import { Code2, Database, BookOpen, HelpCircle } from 'lucide-react';
import { SparqlPlaygroundHelp } from './SparqlPlaygroundHelp';

interface Triple {
  id: string;
  subject: string;
  predicate: string;
  object: string;
  type?: 'resource' | 'literal';
}

interface SparqlPlaygroundProps {
  initialTriples?: Triple[];
}

const exampleQueries = [
  {
    title: '모든 트리플',
    query: `PREFIX : <http://example.org/>

SELECT ?s ?p ?o
WHERE {
  ?s ?p ?o .
}`
  },
  {
    title: '특정 주어',
    query: `PREFIX : <http://example.org/>

SELECT ?predicate ?object
WHERE {
  :김철수 ?predicate ?object .
}`
  },
  {
    title: '특정 속성',
    query: `PREFIX : <http://example.org/>

SELECT ?subject ?object
WHERE {
  ?subject :hasName ?object .
}`
  },
  {
    title: '패턴 매칭',
    query: `PREFIX : <http://example.org/>

SELECT ?person ?name
WHERE {
  ?person :type :Person .
  ?person :hasName ?name .
}`
  }
];

const sampleTriples: Triple[] = [
  { id: '1', subject: ':김철수', predicate: ':type', object: ':Person', type: 'resource' },
  { id: '2', subject: ':김철수', predicate: ':hasName', object: '김철수', type: 'literal' },
  { id: '3', subject: ':김철수', predicate: ':hasAge', object: '30', type: 'literal' },
  { id: '4', subject: ':김철수', predicate: ':worksAt', object: ':회사A', type: 'resource' },
  { id: '5', subject: ':이영희', predicate: ':type', object: ':Person', type: 'resource' },
  { id: '6', subject: ':이영희', predicate: ':hasName', object: '이영희', type: 'literal' },
  { id: '7', subject: ':이영희', predicate: ':hasAge', object: '28', type: 'literal' },
  { id: '8', subject: ':이영희', predicate: ':worksAt', object: ':회사B', type: 'resource' },
  { id: '9', subject: ':회사A', predicate: ':type', object: ':Company', type: 'resource' },
  { id: '10', subject: ':회사A', predicate: ':hasName', object: '테크코프', type: 'literal' },
];

export const SparqlPlayground: React.FC<SparqlPlaygroundProps> = ({
  initialTriples = sampleTriples
}) => {
  const [triples, setTriples] = useState<Triple[]>(initialTriples);
  const [showHelp, setShowHelp] = useState(false);

  // RDF Editor에서 데이터 받기
  useEffect(() => {
    const savedData = localStorage.getItem('rdf-editor-triples-for-sparql');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // 데이터 읽은 후 삭제 (일회성)
        localStorage.removeItem('rdf-editor-triples-for-sparql');

        // 시간 체크 (5분 이내)
        const timestamp = new Date(parsed.timestamp);
        const now = new Date();
        const diffMinutes = (now.getTime() - timestamp.getTime()) / (1000 * 60);

        if (diffMinutes < 5 && parsed.triples && Array.isArray(parsed.triples)) {
          // Triple 형식으로 변환
          const convertedTriples = parsed.triples.map((t: any, idx: number) => ({
            id: `imported-${idx}`,
            subject: t.subject,
            predicate: t.predicate,
            object: t.object,
            type: t.type || 'resource'
          }));
          setTriples(convertedTriples);
        }
      } catch (error) {
        console.error('Error loading triples from RDF Editor:', error);
      }
    }
  }, []);

  const { queryResult, error, isLoading, executeQuery } = useSparqlQuery(triples);

  return (
    <div className="max-w-7xl mx-auto p-6 pb-20 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">SPARQL 쿼리 플레이그라운드</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowHelp(true)}
            className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-md hover:bg-green-200 dark:hover:bg-green-900/50 flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4" />
            도움말
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Database className="w-4 h-4" />
            <span>{triples.length}개 트리플</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 왼쪽: 쿼리 에디터 */}
        <div className="space-y-6">
          <QueryEditor
            onExecute={executeQuery}
            isLoading={isLoading}
            exampleQueries={exampleQueries}
          />

          {/* 데이터 미리보기 */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Database className="w-4 h-4" />
              샘플 데이터 (RDF 트리플)
            </h3>
            <div className="max-h-64 overflow-y-auto">
              <div className="space-y-1 text-xs font-mono">
                {triples.slice(0, 10).map((triple) => (
                  <div key={triple.id} className="flex items-center gap-2">
                    <span className="text-blue-600 dark:text-blue-400">
                      {triple.subject}
                    </span>
                    <span className="text-green-600 dark:text-green-400">
                      {triple.predicate}
                    </span>
                    <span className={triple.type === 'literal'
                      ? 'text-orange-600 dark:text-orange-400'
                      : 'text-blue-600 dark:text-blue-400'}>
                      {triple.type === 'literal' ? `"${triple.object}"` : triple.object}
                    </span>
                    <span className="text-gray-500">.</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽: 결과 뷰 */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-700 p-6">
          <ResultsView result={queryResult} error={error} />
        </div>
      </div>

      {/* 도움말 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          SPARQL 쿼리 가이드
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-semibold mb-2">기본 문법</h4>
            <ul className="space-y-1 text-gray-700 dark:text-gray-300">
              <li>• <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">SELECT</code> - 반환할 변수 지정</li>
              <li>• <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">WHERE</code> - 패턴 매칭 조건</li>
              <li>• <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">?변수명</code> - 변수 선언</li>
              <li>• <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">.</code> - 패턴 구분자</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">패턴 매칭</h4>
            <ul className="space-y-1 text-gray-700 dark:text-gray-300">
              <li>• 트리플 패턴: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">?s ?p ?o</code></li>
              <li>• 고정값 사용: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">:김철수 ?p ?o</code></li>
              <li>• 다중 패턴: 여러 줄로 AND 조건</li>
              <li>• 같은 변수 = 같은 값 매칭</li>
            </ul>
          </div>
        </div>
      </div>

      <SparqlPlaygroundHelp isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
};
