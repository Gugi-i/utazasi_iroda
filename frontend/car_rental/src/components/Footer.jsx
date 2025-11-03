// components/Footer.js
import React from 'react';
import './Footer.css'; // CSS for the footer

function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-logo">
                        <img src="../../src/assets/logo.png" alt="Speedy Rentals Logo" />
                        <span>SPEEDY RENTALS</span>
                    </div>
                    <nav className="footer-nav">
                        <ul>
                            <li><a href="#about">About Us</a></li>
                            <li><a href="#faq">FAQ</a></li>
                            <li><a href="#privacy">Privacy Policy</a></li>
                        </ul>
                    </nav>
                    <div className="social-links">
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            {/* You'd use an icon component or an svg here */}
                            Twitter
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            {/* You'd use an icon component or an svg here */}
                            Instagram
                        </a>
                    </div>
                </div>
                <p className="copyright">&copy; {new Date().getFullYear()} Speedy Rentals. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
