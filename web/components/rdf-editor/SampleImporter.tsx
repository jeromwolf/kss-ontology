'use client';

import React, { useState } from 'react';
import { FileCode2, X, Check } from 'lucide-react';
import { sampleTriples, SampleTripleKey } from './data/sampleTriples';

interface SampleImporterProps {
  onImport: (data: Array<{
    subject: string;
    predicate: string;
    object: string;
    type?: 'resource' | 'literal';
  }>) => void;
}

export const SampleImporter: React.FC<SampleImporterProps> = ({ onImport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSample, setSelectedSample] = useState<SampleTripleKey | null>(null);

  const handleImport = () => {
    if (selectedSample) {
      const sample = sampleTriples[selectedSample];
      onImport(sample.data);
      setIsOpen(false);
      setSelectedSample(null);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 flex items-center gap-2"
      >
        <FileCode2 className="w-4 h-4" />
        샘플 가져오기
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold">샘플 온톨로지 선택</h2>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSelectedSample(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {(Object.entries(sampleTriples) as [SampleTripleKey, typeof sampleTriples[SampleTripleKey]][]).map(
                ([key, sample]) => (
                  <div
                    key={key}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedSample === key
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedSample(key)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{sample.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {sample.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          트리플 개수: {sample.data.length}개
                        </p>
                      </div>
                      {selectedSample === key && (
                        <div className="ml-4">
                          <Check className="w-6 h-6 text-blue-500" />
                        </div>
                      )}
                    </div>

                    {selectedSample === key && (
                      <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono overflow-x-auto">
                        <div className="space-y-1">
                          {sample.data.slice(0, 3).map((triple, idx) => (
                            <div key={idx} className="text-gray-600 dark:text-gray-400">
                              {triple.subject} → {triple.predicate} → {triple.object}
                            </div>
                          ))}
                          {sample.data.length > 3 && (
                            <div className="text-gray-500">... 외 {sample.data.length - 3}개</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>

            <div className="flex justify-end gap-3 p-6 border-t dark:border-gray-700">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSelectedSample(null);
                }}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                취소
              </button>
              <button
                onClick={handleImport}
                disabled={!selectedSample}
                className={`px-4 py-2 rounded-md ${
                  selectedSample
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                가져오기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};