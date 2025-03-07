import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import Dashboard from './screens/Dashboard'

import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
export default App;
