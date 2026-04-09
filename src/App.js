import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './Shared/Header/Header';
import AllPage from './Pages/All-Page/AllPage';
import Dashboard from './Pages/Dashboard/Dashboard';
import About from './Pages/About/About';
import Contact from './Pages/Contact/Contact';
import WhyUsPage from './Pages/WhyUs/WhyUsPage';
import InterestedSchoolsPage from './Pages/InteretedSchools/InterestedSchoolsPage';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Layout() {
  const location = useLocation();

  // ✅ Safer Title Logic: Path change holeo jate crash na kore
  const getTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard";
    
    // Prothom slash soriye baki ongshota ke Title banano
    return path
      .split('/')
      .filter(Boolean)[0] // Empty string bad deya
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const title = getTitle();

  return (
    <>
      <Header title={title} />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* ✅ Strict Path matching */}
        <Route path="/all-page" element={<AllPage />} />
        <Route path='/about-control' element={<About />} />
        <Route path='/contact-control' element={<Contact />} />
        <Route path='/why-us' element={<WhyUsPage />} />
        <Route path="/interested-schools" element={<InterestedSchoolsPage />} />
        
        {/* ✅ Catch-all route: Jodi kono path na mele tobe Dashboard-e niye jabe */}
        <Route path="*" element={<Dashboard />} />
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