import { useState, useCallback } from 'react';
import { logger } from '../utils/logger';

export function useAsyncOperation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeAsync = useCallback(async (operation, operationName = 'Operation') => {
    setIsLoading(true);
    setError(null);
    
    const startTime = Date.now();
    
    try {
      logger.debug(`${operationName} started`);
      const result = await operation();
      
      const duration = Date.now() - startTime;
      logger.info(`${operationName} completed successfully`, { duration });
      
      return result;
    } catch (err) {
      const duration = Date.now() - startTime;
      const errorMessage = err.message || 'Unknown error occurred';
      
      setError(errorMessage);
      logger.error(`${operationName} failed`, { 
        error: errorMessage, 
        duration,
        stack: err.stack 
      });
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return { 
    isLoading, 
    error, 
    executeAsync, 
    clearError, 
    reset 
  };
}

export function useAsyncOperationWithRetry(maxRetries = 3, retryDelay = 1000) {
  const { isLoading, error, executeAsync, clearError, reset } = useAsyncOperation();
  const [retryCount, setRetryCount] = useState(0);

  const executeWithRetry = useCallback(async (operation, operationName = 'Operation') => {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        setRetryCount(attempt);
        
        if (attempt > 0) {
          logger.info(`${operationName} retry attempt ${attempt}/${maxRetries}`);
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
        }
        
        const result = await executeAsync(operation, operationName);
        setRetryCount(0);
        return result;
      } catch (err) {
        lastError = err;
        
        if (attempt === maxRetries) {
          logger.error(`${operationName} failed after ${maxRetries} retries`, {
            error: err.message,
            totalAttempts: attempt + 1
          });
          break;
        }
      }
    }
    
    throw lastError;
  }, [executeAsync, maxRetries, retryDelay]);

  return {
    isLoading,
    error,
    retryCount,
    executeWithRetry,
    clearError,
    reset
  };
}
