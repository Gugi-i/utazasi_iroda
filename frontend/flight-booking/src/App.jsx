import './App.css';
import Home from './components/Home.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home  />} />
                {/*<Route*/}
                {/*    path="/login"*/}
                {/*    element={<Login onLoginSuccess={handleLogin} />}*/}
                {/*/>*/}
                {/*<Route path="/login" element={<Login />} />*/}
                {/*<Route path="/sign-up" element={<Signup />} />*/}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
