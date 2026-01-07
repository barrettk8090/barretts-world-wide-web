import Home from './components/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";


import './App.css'
import Photos from './pages/Photos/Photos';
import Fiction from './pages/Fiction/Fiction';
import PersonalBlog from './pages/PersonalBlog/PersonalBlog';
import Learning from './pages/Learning/Learning';
import Watching from './pages/Watching/Watching';
import Reading from './pages/Reading/Reading';
import Searching from './pages/Searching/Searching';

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
          path="/camera-roll"
          element={<Photos/>}/>
        <Route
          path="/fiction"
          element={<Fiction/>}/>
        <Route
          path="/blog"
          element={<PersonalBlog/>}/>
        <Route
          path="/learning"
          element={<Learning/>}/>
        <Route
          path="/watching"
          element={<Watching/>}/>
        <Route
          path="/reading"
          element={<Reading/>}/>
        <Route
          path="/searching"
          element={<Searching/>}/>
      </Routes>
    </Router>
    <Footer/>
    </>
  )
}

export default App
