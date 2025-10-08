
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import RegisterPage from './pages/RegisterPage';

// You'll need to create this component or import it
const Home = () => <div>Home Page</div>;

function App() {
  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/register" element={<RegisterPage/>} />

      </Routes>
      
    </BrowserRouter>
  )
}

export default App
