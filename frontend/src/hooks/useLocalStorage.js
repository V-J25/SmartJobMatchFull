import { useCallback, useState } from 'react'

function getInitialValue(key, initialValue) {
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : initialValue
  } catch {
    return initialValue
  }
}

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() =>
    getInitialValue(key, initialValue),
  )

  const setValue = useCallback(
    (value) => {
      setStoredValue((currentValue) => {
        const nextValue =
          typeof value === 'function' ? value(currentValue) : value

        try {
          if (nextValue === null || nextValue === undefined) {
            window.localStorage.removeItem(key)
          } else {
            window.localStorage.setItem(key, JSON.stringify(nextValue))
          }
        } catch {
          // Keep React state working even if browser storage is unavailable.
        }

        return nextValue
      })
    },
    [key],
  )

  return [storedValue, setValue]
}

export default useLocalStorage
