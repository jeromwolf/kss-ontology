'use client';

import React, { useState, useEffect } from 'react';
import { Zap, Info, ChevronRight } from 'lucide-react';

interface Triple {
  subject: string;
  predicate: string;
  object: string;
  type?: 'resource' | 'literal';
}

interface InferredTriple extends Triple {
  rule: string;
  confidence: number;
  source: string[];
}

interface InferenceEngineProps {
  triples: Triple[];
  onInferredTriplesChange?: (inferred: InferredTriple[]) => void;
}

const INFERENCE_RULES = [
  {
    id: 'symmetric',
    name: '대칭 속성',
    description: 'A가 B와 관계가 있으면, B도 A와 같은 관계를 가짐',
    pattern: ['?a', '?p', '?b'],
    condition: (p: string) => ['knows', 'marriedTo', 'siblingOf', 'friendOf'].includes(p.replace(':', '')),
    inference: (bindings: any) => ({
      subject: bindings.b,
      predicate: bindings.p,
      object: bindings.a,
      rule: 'symmetric',
      confidence: 0.9
    })
  },
  {
    id: 'transitive',
    name: '이행 속성',
    description: 'A→B, B→C이면 A→C',
    patterns: [
      ['?a', '?p', '?b'],
      ['?b', '?p', '?c']
    ],
    condition: (p: string) => ['subClassOf', 'partOf', 'locatedIn', 'ancestorOf'].includes(p.replace(':', '')),
    inference: (bindings: any) => ({
      subject: bindings.a,
      predicate: bindings.p,
      object: bindings.c,
      rule: 'transitive',
      confidence: 0.85
    })
  },
  {
    id: 'type-inference',
    name: '타입 추론',
    description: '속성의 도메인/레인지로부터 타입 추론',
    pattern: ['?s', '?p', '?o'],
    domainRange: {
      'teaches': { domain: 'Teacher', range: 'Course' },
      'enrolledIn': { domain: 'Student', range: 'Course' },
      'worksAt': { domain: 'Person', range: 'Company' },
      'hasAge': { domain: 'Person', range: 'literal' }
    },
    inference: (bindings: any, domainRange: any) => {
      const prop = bindings.p.replace(':', '');
      const dr = domainRange[prop];
      if (!dr) return [];
      
      const results = [];
      if (dr.domain && dr.domain !== 'literal') {
        results.push({
          subject: bindings.s,
          predicate: ':type',
          object: ':' + dr.domain,
          rule: 'type-inference-domain',
          confidence: 0.8
        });
      }
      if (dr.range && dr.range !== 'literal') {
        results.push({
          subject: bindings.o,
          predicate: ':type',
          object: ':' + dr.range,
          rule: 'type-inference-range',
          confidence: 0.8
        });
      }
      return results;
    }
  },
  {
    id: 'inverse',
    name: '역관계',
    description: '관계의 역방향 추론',
    pattern: ['?s', '?p', '?o'],
    inverses: {
      'hasParent': 'hasChild',
      'hasChild': 'hasParent',
      'teaches': 'taughtBy',
      'employs': 'employedBy'
    },
    inference: (bindings: any, inverses: any) => {
      const prop = bindings.p.replace(':', '');
      const inverse = inverses[prop];
      if (!inverse) return null;
      
      return {
        subject: bindings.o,
        predicate: ':' + inverse,
        object: bindings.s,
        rule: 'inverse',
        confidence: 0.95
      };
    }
  }
];

export const InferenceEngine: React.FC<InferenceEngineProps> = ({
  triples,
  onInferredTriplesChange
}) => {
  const [inferredTriples, setInferredTriples] = useState<InferredTriple[]>([]);
  const [isInferring, setIsInferring] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    performInference();
  }, [triples]);

  const performInference = () => {
    setIsInferring(true);
    const inferred: InferredTriple[] = [];
    const existingTriples = new Set(
      triples.map(t => `${t.subject}|${t.predicate}|${t.object}`)
    );

    // 각 규칙 적용
    INFERENCE_RULES.forEach(rule => {
      if (rule.id === 'symmetric') {
        triples.forEach(triple => {
          if (rule.condition && rule.condition(triple.predicate)) {
            const newTriple = rule.inference({
              a: triple.subject,
              p: triple.predicate,
              b: triple.object
            });
            const key = `${newTriple.subject}|${newTriple.predicate}|${newTriple.object}`;
            if (!existingTriples.has(key)) {
              inferred.push({
                ...newTriple,
                source: [`${triple.subject} ${triple.predicate} ${triple.object}`]
              });
            }
          }
        });
      } else if (rule.id === 'transitive') {
        triples.forEach(t1 => {
          triples.forEach(t2 => {
            if (t1.object === t2.subject && 
                t1.predicate === t2.predicate && 
                rule.condition && rule.condition(t1.predicate)) {
              const newTriple = rule.inference({
                a: t1.subject,
                p: t1.predicate,
                b: t1.object,
                c: t2.object
              });
              const key = `${newTriple.subject}|${newTriple.predicate}|${newTriple.object}`;
              if (!existingTriples.has(key) && t1.subject !== t2.object) {
                inferred.push({
                  ...newTriple,
                  source: [
                    `${t1.subject} ${t1.predicate} ${t1.object}`,
                    `${t2.subject} ${t2.predicate} ${t2.object}`
                  ]
                });
              }
            }
          });
        });
      } else if (rule.id === 'type-inference') {
        triples.forEach(triple => {
          const results = rule.inference(
            {
              s: triple.subject,
              p: triple.predicate,
              o: triple.object
            },
            rule.domainRange
          );
          if (Array.isArray(results)) {
            results.forEach(result => {
              const key = `${result.subject}|${result.predicate}|${result.object}`;
              if (!existingTriples.has(key)) {
                inferred.push({
                  ...result,
                  source: [`${triple.subject} ${triple.predicate} ${triple.object}`]
                });
              }
            });
          }
        });
      } else if (rule.id === 'inverse') {
        triples.forEach(triple => {
          const result = rule.inference(
            {
              s: triple.subject,
              p: triple.predicate,
              o: triple.object
            },
            rule.inverses
          );
          if (result) {
            const results = Array.isArray(result) ? result : [result];
            results.forEach(r => {
              const key = `${r.subject}|${r.predicate}|${r.object}`;
              if (!existingTriples.has(key)) {
                inferred.push({
                  ...r,
                  source: [`${triple.subject} ${triple.predicate} ${triple.object}`]
                });
              }
            });
          }
        });
      }
    });

    setInferredTriples(inferred);
    if (onInferredTriplesChange) {
      onInferredTriplesChange(inferred);
    }
    setIsInferring(false);
  };

  return (
    <div className="space-y-4 pb-16">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          추론 엔진
        </h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        >
          {showDetails ? '간단히' : '자세히'} 보기
        </button>
      </div>

      {isInferring ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">추론 중...</p>
        </div>
      ) : (
        <>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {inferredTriples.length}개의 새로운 사실이 추론되었습니다.
                </p>
                {showDetails && (
                  <ul className="mt-2 text-xs text-blue-600 dark:text-blue-400 space-y-1">
                    <li>• 대칭 속성: 양방향 관계 추론</li>
                    <li>• 이행 속성: 연쇄 관계 추론</li>
                    <li>• 타입 추론: 도메인/레인지 기반</li>
                    <li>• 역관계: 반대 방향 관계</li>
                  </ul>
                )}
              </div>
            </div>
          </div>

          {inferredTriples.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {inferredTriples.map((triple, index) => (
                <div
                  key={index}
                  className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-mono text-blue-600 dark:text-blue-400">
                        {triple.subject}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                      <span className="font-mono text-green-600 dark:text-green-400">
                        {triple.predicate}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                      <span className="font-mono text-blue-600 dark:text-blue-400">
                        {triple.object}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.round(triple.confidence * 100)}%
                    </span>
                  </div>
                  {showDetails && (
                    <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                      <p>규칙: {triple.rule}</p>
                      <p>근거: {triple.source.join(' + ')}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};