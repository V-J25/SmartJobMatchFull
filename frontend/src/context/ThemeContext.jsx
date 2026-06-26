import { useEffect } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { ThemeContext } from './themeContextValue'

function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('smart-job-theme', 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
