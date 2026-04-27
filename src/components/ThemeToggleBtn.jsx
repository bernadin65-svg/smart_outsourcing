import React, { useEffect } from 'react'
import assets from '../assets/assets'

const ThemeToggleBtn = ({ theme, setTheme }) => {

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className='size-8 p-1.5 border border-gray-500 rounded-full flex items-center justify-center'
    >
      <img
        src={theme === 'dark' ? assets.sun_icon : assets.moon_icon}
        alt="theme"
      />
    </button>
  )
}

export default ThemeToggleBtn