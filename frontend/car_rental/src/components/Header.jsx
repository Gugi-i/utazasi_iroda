// components/Header.js
import React from 'react';
import './Header.css';
import { useNavigate } from "react-router-dom"

function Header({ username }) {
    const navigate = useNavigate();

    const navigateToLogin = () => {
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="container">
                <div className="logo">
                    <img src="../../src/assets/logo.png" alt="Speedy Rentals Logo" />
                    <span>SPEEDY RENTALS</span>
                </div>
                <nav className="nav-menu">
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#browse">Browse Cars</a></li>
                        <li><a href="#how-it-works">How It Works</a></li>
                        {username === "" ? (
                            <li>
                                <button className="sign-up-btn" id="login" onClick={navigateToLogin}>Login</button>
                            </li>
                        ) : (
                            <li>
                                <a href="#welcome">Welcome, {username}!</a>
                            </li>
                        )}
                        {username !== "" ?
                            (
                                <li>
                                    <button className="sign-up-btn" id="logout" onClick={() => window.location.reload()}>Logout</button>
                                </li>
                            ) : null
                        }
                    </ul>
                </nav>
            </div>
        </header>
    );
}



export default Header;
