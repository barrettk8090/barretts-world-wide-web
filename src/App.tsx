import { useState } from 'react'
import Navbar from './components/Navbar'
import Experience from './components/Experience'
import Footer from './components/Footer'
import './App.css'

function App() {

  return (
    <>
      <div>
        <h1>barrett's www</h1>
        <p>barrett kowalsky – a guy doing many different things. based in denver, co.</p>
        <p>🚧 this site is under active construction, partner 🤠. please wear a hardhat while navigating. 👷‍♂️</p>
        <Navbar/>
        <Experience/>
        <Footer/>
      </div>
    </>
  )
}

export default App
