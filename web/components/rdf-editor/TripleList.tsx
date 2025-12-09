'use client';

import React from 'react';
import { Trash2, Edit2, ArrowRight } from 'lucide-react';

interface Triple {
  id: string;
  subject: string;
  predicate: string;
  object: string;
  type?: 'resource' | 'literal';
}

interface TripleListProps {
  triples: Triple[];
  selectedTriple?: Triple | null;
  onSelect: (triple: Triple) => void;
  onEdit: (triple: Triple) => void;
  onDelete: (id: string) => void;
}

export const TripleList: React.FC<TripleListProps> = ({
  triples,
  selectedTriple,
  onSelect,
  onEdit,
  onDelete,
}) => {
  if (triples.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        트리플이 없습니다. 위 폼을 사용하여 추가해주세요.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {triples.map((triple) => (
        <div
          key={triple.id}
          className={`
            p-4 rounded-lg border cursor-pointer transition-all
            ${selectedTriple?.id === triple.id
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }
          `}
          onClick={() => onSelect(triple)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1">
              <span className="font-mono text-sm text-blue-600 dark:text-blue-400">
                {triple.subject}
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <span className="font-mono text-sm text-green-600 dark:text-green-400">
                {triple.predicate}
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <span className={`font-mono text-sm ${
                triple.type === 'literal' 
                  ? 'text-orange-600 dark:text-orange-400' 
                  : 'text-blue-600 dark:text-blue-400'
              }`}>
                {triple.type === 'literal' ? `"${triple.object}"` : triple.object}
              </span>
              {triple.type === 'literal' && (
                <span className="text-xs text-gray-500 dark:text-gray-400">(리터럴)</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(triple);
                }}
                className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(triple.id);
                }}
                className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};