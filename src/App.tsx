
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';

// You'll need to create this component or import it
const Home = () => <div>Home Page</div>;

function App() {
  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage/>} />

      </Routes>
      
    </BrowserRouter>
  )
}

export default App
