// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './Shared/Header/Header';
import Dashboard from './Pages/Dashboard/Dashboard';
import HomePage from './Pages/Home/HomePage';




function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>

          <Route path="/" element={<Dashboard />} />
          <Route path="/HomePage" element={<HomePage />} />
        </Routes>
      </Router>



    </div>
  );
}

export default App;