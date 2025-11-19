import {useNavigate} from "react-router-dom";
import './Login.css';
import React, {useState} from "react";

function Login({ onLoginSuccess, onClose }) {
    const navigate = useNavigate();

    const confirmLogin = (event) => {
        event.preventDefault()
        // API call to authenticate user would go here
        let successfulLogin = true; // Simulating a successful login response
        if (successfulLogin) {
            // navigate('/', { replace: true });
            onLoginSuccess(document.getElementById("email").value);
        }
    };

    const navigateToSignUp = () => {
        navigate('/sign-up');
    }

    return (
        <div className="modal-overlay">
            <div className="modal-panel">
                <h2>Login to Speedy Rentals</h2>
                <form className="login-form" onSubmit={confirmLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" required/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" required/>
                    </div>

                    <div className="button-row">
                        <button
                            className="primary-btn"
                        >
                            Login
                        </button>

                        <button
                            className="close-btn"
                            onClick={() => {
                                onClose();
                            }}
                        >
                            Close
                        </button>
                    </div>
                </form>
                <div className="login-help">
                    <a href="#forgot-password">Forgot Password?</a>
                    <span className="separator">|</span>
                    <a onClick={navigateToSignUp} className="sign-up-link">Sign Up</a>
                </div>
            </div>
        </div>
    );
}

export default Login;
