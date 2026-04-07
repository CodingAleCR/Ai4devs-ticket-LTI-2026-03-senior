import React from 'react'
import logo from './logo.svg'

const App = () => {
  return (
    <div className="text-center">
      <header className="flex min-h-screen flex-col items-center justify-center bg-[#282c34] text-[calc(10px+2vmin)] text-white">
        <img
          src={logo}
          className="pointer-events-none h-[40vmin] motion-safe:animate-[spin_20s_linear_infinite] motion-reduce:animate-none"
          alt="logo"
        />
        <p>
          Edit{' '}
          <code className="rounded bg-white/10 px-1 py-0.5 font-mono">
            src/App.tsx
          </code>{' '}
          and save to reload.
        </p>
        <a
          className="text-[#61dafb]"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App
