import Home from './components/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";


import './App.css'
import Photos from './pages/Photos';

function App() {

  return (
    <>
    <Router> 
      <Navbar/>
      <Routes>
        <Route 
          path="/"
          element={<Home/>}/>  
        <Route
          path="/photos"
          element={<Photos/>}/>
      </Routes>
    </Router>
    <Footer/>
    </>
  )
}

export default App
