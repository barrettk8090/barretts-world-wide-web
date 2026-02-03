import Home from './components/Home';
// import Navbar from './components/Navbar';
import Footer from './components/Footer'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Link,
  useLocation,
} from "react-router-dom";


import './App.css'
import Photos from './pages/Photos/Photos';
import Photography from './pages/Photography/Photography';
import Fiction from './pages/Fiction/Fiction';
import PersonalBlog from './pages/PersonalBlog/PersonalBlog';
import BlogPost from './pages/PersonalBlog/BlogPost';
import DevContent from './pages/Dev-Content/DevContent';
import Projects from './pages/Projects/Projects';
import Learning from './pages/Learning/Learning';
import Watching from './pages/Watching/Watching';
import Reading from './pages/Reading/Reading';
import Searching from './pages/Searching/Searching';
import Donate from './pages/Donate/Donate';
import TheDream from './pages/The-Dream/TheDream';

function MainLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="page-wrapper">
      <main className="page-content">
        {!isHome && (
          <div className="home-bar">
            <Link to="/" className="home-back-link">HOME</Link>
            <hr/>
          </div>
        )}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {

  return (
    <Router> 
      <Routes>
        {/* awake type shit */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home/>}/>  
          <Route path="/camera-roll" element={<Photos/>}/>
          <Route path="/photography" element={<Photography/>}/>
          <Route path="/blog" element={<PersonalBlog/>}/>
          <Route path="/blog/:slug" element={<BlogPost/>}/>
          <Route path="/fiction" element={<Fiction/>}/>
          <Route path="/dev-content" element={<DevContent/>}/>
          <Route path="/projects" element={<Projects/>}/>
          <Route path="/learning" element={<Learning/>}/>
          <Route path="/watching" element={<Watching/>}/>
          <Route path="/reading" element={<Reading/>}/>
          <Route path="/searching" element={<Searching/>}/>
          <Route path="/donate" element={<Donate/>}/>
        </Route>

        {/* dream type shit */}
        <Route path="/the-dream" element={<TheDream/>}/>
      </Routes>
    </Router>
  )
}

export default App
