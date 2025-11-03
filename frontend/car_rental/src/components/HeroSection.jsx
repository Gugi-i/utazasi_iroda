// components/HeroSection.js
import React from 'react';
import './HeroSection.css'; // CSS for the hero section

function HeroSection() {
    return (
        <section id="home" className="hero-section">
            <div className="container">
                <div className="hero-content">
                    <h1>Unlock Your Next Adventure</h1>
                    <p>Find the perfect car for your journey.</p>
                </div>
                {/* The car image will likely be a background image in CSS */}
                <div className="hero-image"></div>
            </div>
        </section>
    );
}

export default HeroSection;
