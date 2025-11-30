import React from 'react';
import './HeroSection.css';

function HeroSection() {
    return (
        <section id="home" className="hero-section">
            <div className="container">
                <div className="hero-content">
                    <h1>Unlock Your Next Adventure</h1>
                    <p>Find the perfect flight for your journey.</p>
                </div>
                <div className="hero-image"></div>
            </div>
        </section>
    );
}

export default HeroSection;