// components/HowItWorks.js
import React from 'react';
import './HowItWorks.css'; // CSS for how it works section

function HowItWorks() {
    return (
        <section id="how-it-works" className="how-it-works-section">
            <div className="container">
                <h2>How it Works</h2>
                <div className="steps-container">
                    <div className="step">
                        <img src="../../src/assets/choose_car.png" alt="Choose Car" />
                        <h3>1. Choose Your Car</h3>
                        <p>Select from our wide range of vehicles.</p>
                    </div>
                    <div className="step">
                        <img src="../../src/assets/pick_up.png" alt="Pick Up" />
                        <h3>2. Pick Up</h3>
                        <p>Grab your car at your selected location.</p>
                    </div>
                    <div className="step">
                        <img src="../../src/assets/return.png" alt="Return" />
                        <h3>3. Return</h3>
                        <p>Return the car conveniently at the end of your trip.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;
