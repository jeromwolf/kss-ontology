'use client';

import React, { useMemo, useState } from 'react';
import { useD3Graph } from './hooks/useD3Graph';
import { Maximize2, Box } from 'lucide-react';
import Link from 'next/link';

interface Triple {
  id: string;
  subject: string;
  predicate: string;
  object: string;
  type?: 'resource' | 'literal';
}

interface TripleVisualizationProps {
  triples: Triple[];
  selectedTriple?: Triple | null;
  width?: number;
  height?: number;
}

export const TripleVisualization: React.FC<TripleVisualizationProps> = ({
  triples,
  selectedTriple,
  width = 800,
  height = 600,
}) => {
  const graphData = useMemo(() => {
    const nodeMap = new Map<string, { id: string; label: string; type: 'resource' | 'literal' }>();
    const links: { source: string; target: string; label: string }[] = [];

    triples.forEach(triple => {
      if (!nodeMap.has(triple.subject)) {
        nodeMap.set(triple.subject, {
          id: triple.subject,
          label: triple.subject,
          type: 'resource'
        });
      }

      if (!nodeMap.has(triple.object)) {
        nodeMap.set(triple.object, {
          id: triple.object,
          label: triple.object,
          type: triple.type || 'resource'
        });
      }

      links.push({
        source: triple.subject,
        target: triple.object,
        label: triple.predicate
      });
    });

    return {
      nodes: Array.from(nodeMap.values()),
      links
    };
  }, [triples]);

  const selectedNodeId = useMemo(() => {
    if (!selectedTriple) return null;
    return selectedTriple.subject;
  }, [selectedTriple]);

  const svgRef = useD3Graph(graphData, width, height, selectedNodeId);

  const handleView3D = () => {
    // Save triples to localStorage before navigation
    const triplesData = triples.map(({ subject, predicate, object, type }) => ({
      subject,
      predicate,
      object,
      type: type || 'resource'
    }));
    
    localStorage.setItem('rdf-editor-triples', JSON.stringify({
      triples: triplesData,
      timestamp: new Date().toISOString(),
      source: 'rdf-editor'
    }));
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
      <div className="p-4 border-b bg-gray-50 dark:bg-gray-800 flex justify-between items-start">
        <div>
          <h3 className="font-semibold">그래프 시각화</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            노드를 드래그하여 이동할 수 있습니다. 스크롤로 확대/축소가 가능합니다.
          </p>
        </div>
        <Link
          href="/3d-graph"
          onClick={handleView3D}
          className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded hover:bg-purple-200 dark:hover:bg-purple-900/50 flex items-center gap-2 text-sm"
        >
          <Box className="w-4 h-4" />
          3D 보기
        </Link>
      </div>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full h-full"
        style={{ cursor: 'grab' }}
      />
    </div>
  );
};