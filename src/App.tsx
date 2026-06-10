import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import PersonalBlog from './pages/PersonalBlog/PersonalBlog';
import BlogPost from './pages/PersonalBlog/BlogPost';
import CV from './pages/CV/CV';
import About from './pages/About/About';
import VideoPage from './pages/Video/Video';

import './App.css';

function MainLayout() {
  return (
    <div className="page-wrapper">
      <Header />
      <main className="page-content">
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
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<PersonalBlog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/cv" element={<CV />} />
          <Route path="/video" element={<VideoPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
