import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import Header from './Shared/Header/Header';
import HomePage from './Pages/Home/HomePage';
import Dashboard from './Pages/Dashboard/Dashboard';
import About from './Pages/About/About';
import Contact from './Pages/Contact/Contact';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Layout() {

  const location = useLocation();

  const title =
    location.pathname === "/"
      ? "Dashboard"
      : location.pathname
        .replace("/", "")
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <>
      <Header title={title} />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/home-page" element={<HomePage />} />
        <Route path='/about-control' element={<About />} />
        <Route path='/contact-control' element={<Contact />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <Router>
        <ToastContainer
            position="top-center"
            toastClassName="center-toast"
            bodyClassName="center-toast-body"
            closeOnClick={false}
            draggable={false}
          />
        <Layout />

      </Router>
    </div>
  );
}

export default App;