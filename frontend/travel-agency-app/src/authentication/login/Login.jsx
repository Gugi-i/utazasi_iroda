import React, { useState } from "react";
import { login } from "../../services/authServices.js";
import Snackbar from "../../components/Snackbar.jsx";
import './Login.css';

function Login({ onLoginSuccess, onShowSignUp }) {
    const [snackbar, setSnackbar] = useState({ show: false, message: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, show: false });
    };

    const confirmLogin = (event) => {
        event.preventDefault();
        setIsLoading(true);

        const email = event.target.email.value;
        const password = event.target.password.value;

        login(email, password)
            .then(user => {
                setTimeout(() => {
                    localStorage.setItem('user', JSON.stringify(user));
                    setIsLoading(false);
                    onLoginSuccess(user);
                }, 1000);
            })
            .catch(err => {
                console.error('Login error:', err);
                setIsLoading(false);
                const errorMessage = "Login failed. Please check your credentials.";
                setSnackbar({ show: true, message: errorMessage, type: 'error' });
            });
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-container">

                <h2>Welcome Back</h2>
                <p className="login-subtitle">Login to plan your next journey</p>

                <form className="login-form" onSubmit={confirmLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="name@example.com"
                            required
                            autoComplete="username"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button className="login-btn" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                {/*<div className="login-help">*/}
                {/*    <p>Don't have an account?*/}
                {/*        <span onClick={onShowSignUp} className="link-text">Sign Up</span>*/}
                {/*    </p>*/}
                {/*</div>*/}
            </div>

            {snackbar.show && (
                <Snackbar
                    message={snackbar.message}
                    type={snackbar.type}
                    onClose={handleCloseSnackbar}
                />
            )}
        </div>
    );
}

export default Login;
