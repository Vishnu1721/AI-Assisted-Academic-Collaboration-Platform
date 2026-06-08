import './App.css';
import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

// Route-based code splitting: each page is loaded on demand instead of in one
// large initial bundle. This shrinks the first-load JS and is the second half
// (alongside the useFetch cache) of the page-load optimization.
const Home = lazy(() => import("./Components/Pages/Home"));
const About = lazy(() => import("./Components/Pages/About"));
const Login = lazy(() => import("./Components/Pages/Login"));
const Signup = lazy(() => import("./Components/Pages/Signup"));
const Questions_page = lazy(() => import("./Components/Pages/Question"));
const Tags = lazy(() => import("./Components/Pages/Tags"));
const Ask_your_query = lazy(() => import("./Components/Pages/Ask_your_query"));
const Article = lazy(() => import("./Components/Pages/Article"));
const Add_Artical = lazy(() => import("./Components/Pages/Add_Article"));
const Add_tags = lazy(() => import("./Components/Pages/Add_tags"));
const Analytics = lazy(() => import("./Components/Pages/Analytics"));

function App() {
  return (
    <Router>
      <Suspense fallback={<div style={{ padding: 40 }}>Loading…</div>}>
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/about' element={<About />} />
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/signup' element={<Signup />} />
          <Route exact path="/question" element={<Questions_page />} />
          <Route exact path='/tags' element={<Tags />} />
          <Route exact path='/ask_your_query' element={<Ask_your_query />} />
          <Route exact path="/article" element={<Article />} />
          <Route exact path="/add_artical" element={<Add_Artical />} />
          <Route exact path="/add_tags" element={<Add_tags />} />
          <Route exact path="/analytics" element={<Analytics />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
