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
import Photography from './pages/Photography/Photography';
import Fiction from './pages/Fiction/Fiction';
import PersonalBlog from './pages/PersonalBlog/PersonalBlog';
import DevContent from './pages/Dev-Content/DevContent';
import Projects from './pages/Projects/Projects';
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
          path="/photography"
          element={<Photography/>}/>
        <Route
          path="/blog"
          element={<PersonalBlog/>}/>
        <Route
          path="/fiction"
          element={<Fiction/>}/>
        <Route
        path="/dev-content"
        element={<DevContent/>}/>
        <Route
          path="/projects"
          element={<Projects/>}/>
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
