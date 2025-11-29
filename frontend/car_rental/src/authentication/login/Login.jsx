import {useNavigate} from "react-router-dom";
import './Login.css';
import React, {useState} from "react";

function Login({ onLoginSuccess, onClose, onShowSignUp }) {
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
                        <button className="primary-btn">Login</button>
                        <button className="close-btn" onClick={() => {
                            onClose();
                        }}>Close
                        </button>
                    </div>
                </form>
                <div className="sign-up-help">
                    <p>Don't have an account? <span onClick={onShowSignUp} className="link-text">Sign Up</span></p>
                </div>
            </div>
        </div>
    );
}

export default Login;
