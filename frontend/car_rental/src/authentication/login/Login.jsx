import {useNavigate} from "react-router-dom";
import './Login.css';
import React, {useState} from "react";
import {login} from "../../services/authServices.js";
import Snackbar from "../../components/Snakbar.jsx";

function Login({ onLoginSuccess, onClose, onShowSignUp }) {
    const [snackbar, setSnackbar] = useState({ show: false, message: '', type: '' });

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, show: false });
    };

    const confirmLogin = (event) => {
        event.preventDefault();

        const email = event.target.email.value;
        const password = event.target.password.value;

        login(email, password)
            .then(user => {
                setTimeout(() => {
                    onLoginSuccess(email);
                }, 1500);
            })
            .catch(err => {
                console.error('Login error:', err);
                const errorMessage = "Login failed. Please try again.";
                setSnackbar({ show: true, message: errorMessage, type: 'error' });
            });
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
