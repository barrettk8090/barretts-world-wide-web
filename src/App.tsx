import { useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './App.css'

function App() {

  return (
    <>
      <div>
        <h1>Barrett Kowalsky</h1>
        <p>a guy doing many different things. based in denver, co.</p>
        <Navbar/>
        <Footer/>
      </div>
    </>
  )
}

export default App
