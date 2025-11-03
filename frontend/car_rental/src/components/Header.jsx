// components/Header.js
import React from 'react';
import './Header.css'; // Assuming you'll have a Header specific CSS

function Header() {
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
                        <li><button className="sign-up-btn">Sign Up</button></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;
