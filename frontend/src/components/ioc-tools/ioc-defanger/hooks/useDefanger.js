import { useState, useCallback } from 'react';
import { defangApi } from '../../shared/services/api/defangApi';

export const useDefanger = () => {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState([]);
  const [operation, setOperation] = useState('defang'); // 'defang' or 'fang'
  const [showOnlyChanged, setShowOnlyChanged] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState('');

  const handleProcess = useCallback(async () => {
    if (!inputText.trim()) {
      setResults([]);
      return;
    }

    try {
      const processedResults = await defangApi.batchProcessIOCs(inputText, operation);
      setResults(processedResults);
    } catch (error) {
      console.error('Error processing IOCs:', error);
      // Fallback to basic processing without backend processing
      const basicResults = inputText.split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(originalIOC => {
          return {
            original: originalIOC,
            processed: originalIOC, // No processing on error
            types: ['Unknown'],
            changed: false
          };
        });
      setResults(basicResults);
    }
  }, [inputText, operation]);

  const handleCopy = useCallback((text, type = 'result') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback(`${type} copied to clipboard!`);
      setTimeout(() => setCopyFeedback(''), 2000);
    }).catch(() => {
      setCopyFeedback('Failed to copy to clipboard');
      setTimeout(() => setCopyFeedback(''), 2000);
    });
  }, []);

  const handleCopyAllResults = useCallback(() => {
    const filteredResults = showOnlyChanged ? results.filter(r => r.changed) : results;
    const allResults = filteredResults.map(r => r.processed).join('\n');
    handleCopy(allResults, 'All results');
  }, [results, showOnlyChanged, handleCopy]);

  const handleSwapOperation = useCallback(async () => {
    const newOperation = operation === 'defang' ? 'fang' : 'defang';
    setOperation(newOperation);
    
    if (results.length > 0) {
      // Re-process with new operation
      try {
        const processedResults = await defangApi.batchProcessIOCs(inputText, newOperation);
        setResults(processedResults);
      } catch (error) {
        console.error('Error re-processing IOCs:', error);
        // Keep existing results if re-processing fails
      }
    }
  }, [operation, inputText, results.length]);

  const handleClear = useCallback(() => {
    setInputText('');
    setResults([]);
    setCopyFeedback('');
  }, []);

  const handleInputChange = useCallback((value) => {
    setInputText(value);
  }, []);

  const handleToggleShowOnlyChanged = useCallback((checked) => {
    setShowOnlyChanged(checked);
  }, []);

  return {
    // State
    inputText,
    results,
    operation,
    showOnlyChanged,
    copyFeedback,
    
    // Actions
    handleProcess,
    handleCopy,
    handleCopyAllResults,
    handleSwapOperation,
    handleClear,
    handleInputChange,
    handleToggleShowOnlyChanged,
    
    // Computed values
    filteredResults: showOnlyChanged ? results.filter(r => r.changed) : results,
    changedCount: results.filter(r => r.changed).length,
    hasResults: results.length > 0
  };
};
