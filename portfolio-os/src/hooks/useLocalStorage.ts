import { useState, useCallback } from 'react';

/**
 * Hook to persist state to localStorage with optional expiration.
 * Handles serialization, deserialization, and expiry checks.
 */
export const useLocalStorage = <T>(key: string, initialValue: T, expiryInSeconds?: number) => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;

      const parsed = JSON.parse(item);

      // Check if the stored data has an expiry timestamp
      if (
        parsed &&
        typeof parsed === 'object' &&
        'expiry' in parsed &&
        typeof parsed.expiry === 'number'
      ) {
        const now = Date.now();
        if (now > parsed.expiry) {
          // Expired, remove and return initial
          window.localStorage.removeItem(key);
          return initialValue;
        }
        return parsed.value;
      }

      // Return raw parsed value (backward compatibility or no expiry used)
      return parsed;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        // Save state
        setStoredValue(valueToStore);

        // Save to local storage
        if (typeof window !== 'undefined') {
          let payload: any = valueToStore;

          // Wrap if expiry is requested
          if (expiryInSeconds) {
            payload = {
              value: valueToStore,
              expiry: Date.now() + expiryInSeconds * 1000,
            };
          } else if (
            typeof valueToStore === 'object' &&
            valueToStore !== null &&
            'expiry' in valueToStore
          ) {
            // Edge case: avoiding confusion if T has expiry but we didn't ask for it?
            // For now, assume if expiryInSeconds is not passed, we store raw.
          }

          window.localStorage.setItem(key, JSON.stringify(payload));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue, expiryInSeconds]
  );

  const removeValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
};
