import { useState, useCallback } from 'react';

interface QueryResult {
  head: {
    vars: string[];
  };
  results: {
    bindings: Array<Record<string, { type: string; value: string }>>;
  };
}

interface Triple {
  subject: string;
  predicate: string;
  object: string;
  type?: 'resource' | 'literal';
}

export const useSparqlQuery = (triples: Triple[]) => {
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 간단한 인메모리 SPARQL 실행기
  const executeQuery = useCallback((query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // SPARQL 파싱 (매우 간단한 버전)
      const selectMatch = query.match(/SELECT\s+(.*?)\s+WHERE/i);
      const whereMatch = query.match(/WHERE\s*\{([\s\S]*)\}/i);

      if (!selectMatch || !whereMatch) {
        throw new Error('올바른 SPARQL 쿼리 형식이 아닙니다.');
      }

      const variables = selectMatch[1]
        .split(/\s+/)
        .filter(v => v.startsWith('?'))
        .map(v => v.substring(1));

      const patterns = whereMatch[1]
        .trim()
        .split('.')
        .map(p => p.trim())
        .filter(p => p.length > 0)
        .map(pattern => {
          const parts = pattern.split(/\s+/);
          if (parts.length < 3) return null;
          return {
            subject: parts[0],
            predicate: parts[1],
            object: parts.slice(2).join(' ').replace(/;$/, '').trim()
          };
        })
        .filter(p => p !== null);

      // 패턴 매칭 실행
      const bindings: Array<Record<string, any>> = [];

      // 모든 가능한 바인딩 조합 찾기
      const findBindings = (patternIndex: number, currentBinding: Record<string, string>) => {
        if (patternIndex >= patterns.length) {
          // 모든 패턴이 매치되면 결과에 추가
          const resultBinding: Record<string, { type: string; value: string }> = {};
          for (const varName of variables) {
            if (currentBinding[varName]) {
              resultBinding[varName] = {
                type: 'literal',
                value: currentBinding[varName]
              };
            }
          }
          if (Object.keys(resultBinding).length === variables.length) {
            bindings.push(resultBinding);
          }
          return;
        }

        const pattern = patterns[patternIndex];
        if (!pattern) return;

        // 각 트리플에 대해 패턴 매칭 시도
        for (const triple of triples) {
          const newBinding = { ...currentBinding };
          let matches = true;

          // Subject 매칭
          if (pattern.subject.startsWith('?')) {
            const varName = pattern.subject.substring(1);
            if (newBinding[varName] && newBinding[varName] !== triple.subject) {
              matches = false;
            } else {
              newBinding[varName] = triple.subject;
            }
          } else if (pattern.subject !== triple.subject) {
            matches = false;
          }

          // Predicate 매칭
          if (matches && pattern.predicate.startsWith('?')) {
            const varName = pattern.predicate.substring(1);
            if (newBinding[varName] && newBinding[varName] !== triple.predicate) {
              matches = false;
            } else {
              newBinding[varName] = triple.predicate;
            }
          } else if (matches && pattern.predicate !== triple.predicate) {
            matches = false;
          }

          // Object 매칭
          if (matches && pattern.object.startsWith('?')) {
            const varName = pattern.object.substring(1);
            if (newBinding[varName] && newBinding[varName] !== triple.object) {
              matches = false;
            } else {
              newBinding[varName] = triple.object;
            }
          } else if (matches && pattern.object !== triple.object) {
            matches = false;
          }

          if (matches) {
            findBindings(patternIndex + 1, newBinding);
          }
        }
      };

      findBindings(0, {});

      // DISTINCT 처리 (중복 제거)
      const uniqueBindings = Array.from(
        new Set(bindings.map(b => JSON.stringify(b)))
      ).map(b => JSON.parse(b));

      setQueryResult({
        head: { vars: variables },
        results: { bindings: uniqueBindings }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '쿼리 실행 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [triples]);

  return {
    queryResult,
    error,
    isLoading,
    executeQuery
  };
};
