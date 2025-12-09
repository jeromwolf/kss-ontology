'use client';

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface TripleFormProps {
  onSubmit: (triple: {
    subject: string;
    predicate: string;
    object: string;
    type: 'resource' | 'literal';
  }) => void;
  initialValues?: {
    subject?: string;
    predicate?: string;
    object?: string;
    type?: 'resource' | 'literal';
  };
  onCancel?: () => void;
}

export const TripleForm: React.FC<TripleFormProps> = ({
  onSubmit,
  initialValues = {},
  onCancel,
}) => {
  const [subject, setSubject] = useState(initialValues?.subject || '');
  const [predicate, setPredicate] = useState(initialValues?.predicate || '');
  const [object, setObject] = useState(initialValues?.object || '');
  const [type, setType] = useState<'resource' | 'literal'>(initialValues?.type || 'resource');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subject && predicate && object) {
      onSubmit({ subject, predicate, object, type });
      if (!initialValues?.subject) {
        setSubject('');
        setPredicate('');
        setObject('');
        setType('resource');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-1">
            주어 (Subject)
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="예: :Person"
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>
        
        <div>
          <label htmlFor="predicate" className="block text-sm font-medium mb-1">
            서술어 (Predicate)
          </label>
          <input
            id="predicate"
            type="text"
            value={predicate}
            onChange={(e) => setPredicate(e.target.value)}
            placeholder="예: :hasName"
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>
        
        <div>
          <label htmlFor="object" className="block text-sm font-medium mb-1">
            목적어 (Object)
          </label>
          <div className="space-y-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'resource' | 'literal')}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-sm"
            >
              <option value="resource">리소스 (다른 개체와 연결)</option>
              <option value="literal">리터럴 (텍스트/숫자 값)</option>
            </select>
            <input
              id="object"
              type="text"
              value={object}
              onChange={(e) => setObject(e.target.value)}
              placeholder={type === 'resource' ? "예: :Employee, :Seoul" : "예: '홍길동', '25', '2024-01-01'"}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              required
            />
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {type === 'resource' 
                ? "리소스: URI로 식별되는 개체. 다른 트리플의 주어가 될 수 있습니다."
                : "리터럴: 실제 데이터 값. 더 이상 연결되지 않는 끝점입니다."}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {initialValues?.subject ? '수정' : '추가'}
        </button>
      </div>
    </form>
  );
};