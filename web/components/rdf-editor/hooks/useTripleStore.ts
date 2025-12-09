import { useState, useCallback } from 'react';
import { OntologyRelation } from '@/types/ontology';

interface RDFTriple {
  id: string;
  subject: string;
  predicate: string;
  object: string;
  type?: 'resource' | 'literal';
  timestamp?: Date;
}

export const useTripleStore = () => {
  const [triples, setTriples] = useState<RDFTriple[]>([]);
  const [selectedTriple, setSelectedTriple] = useState<RDFTriple | null>(null);

  const addTriple = useCallback((triple: Omit<RDFTriple, 'id' | 'timestamp'>) => {
    const newTriple: RDFTriple = {
      ...triple,
      id: `triple-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };
    setTriples(prev => [...prev, newTriple]);
    return newTriple;
  }, []);

  const updateTriple = useCallback((id: string, updates: Partial<RDFTriple>) => {
    setTriples(prev => 
      prev.map(triple => 
        triple.id === id ? { ...triple, ...updates } : triple
      )
    );
  }, []);

  const deleteTriple = useCallback((id: string) => {
    setTriples(prev => prev.filter(triple => triple.id !== id));
    if (selectedTriple?.id === id) {
      setSelectedTriple(null);
    }
  }, [selectedTriple]);

  const clearTriples = useCallback(() => {
    setTriples([]);
    setSelectedTriple(null);
  }, []);

  const exportTriples = useCallback(() => {
    return triples.map(({ subject, predicate, object, type }) => ({
      subject,
      predicate,
      object,
      type: type || 'resource'
    }));
  }, [triples]);

  const importTriples = useCallback((data: Array<Omit<RDFTriple, 'id' | 'timestamp'>>) => {
    const imported = data.map(triple => ({
      ...triple,
      id: `triple-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    }));
    setTriples(prev => [...prev, ...imported]);
  }, []);

  return {
    triples,
    selectedTriple,
    setSelectedTriple,
    addTriple,
    updateTriple,
    deleteTriple,
    clearTriples,
    exportTriples,
    importTriples,
  };
};