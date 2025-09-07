
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

// You'll need to create this component or import it
const Home = () => <div>Home Page</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
