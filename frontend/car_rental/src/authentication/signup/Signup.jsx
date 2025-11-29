import {useNavigate} from "react-router-dom";
import './Signup.css';
import React from "react";

function Signup({ onClose, onShowLogin }) {
    const navigate = useNavigate();

    const confirmSignup = () => {
        // API call to register user would go here
        let successfulSignup = true; // Simulating a successful login response
        if (successfulSignup) {
            onShowLogin();
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-panel">
                <h2>Sign Up to Speedy Rentals</h2>
                <form className="sign-up-form" onSubmit={confirmSignup}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" required/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="Name">Name:</label>
                        <input type="text" id="name" name="name" required/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" required/>
                    </div>

                    <div className="button-row">
                        <button className="primary-btn">Sign Up</button>
                        <button className="close-btn" onClick={() => {onClose();}}>Close</button>
                    </div>
                </form>
                <div className="sign-up-help">
                    <p>Already have an account? <span onClick={onShowLogin} className="link-text">Login</span></p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
