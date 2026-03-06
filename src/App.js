// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './Shared/Header/Header';
import HomePage from './Pages/Home/HomePage';
import Dashboard from './Pages/Dashboard/Dashboard';



function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/HomePage" element={<HomePage />} />
        </Routes>
      </Router>



    </div>
  );
}

export default App;