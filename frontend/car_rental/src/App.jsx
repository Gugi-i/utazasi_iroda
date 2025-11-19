// ... all the imports
import './App.css';
import Home from './components/Home.jsx';
import Login from  './authentication/login/Login.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from "./authentication/signup/Signup.jsx";
import {useState} from "react";

function App() {
    const [username, setUsername] = useState("");

    const handleLogin = (loggedInUsername) => {
        console.log("App received logged in username:", loggedInUsername);
        setUsername(loggedInUsername);
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home username={username} />} />
                <Route
                    path="/login"
                    element={<Login onLoginSuccess={handleLogin} />}
                />
                <Route path="/login" element={<Login />} />
                <Route path="/sign-up" element={<Signup />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
