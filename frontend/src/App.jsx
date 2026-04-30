import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Router from './routes/router'
import { RouterProvider } from 'react-router'

function App() {
  return (
    <>
      <RouterProvider router={Router}/>
    </>
  )
}
export default App
