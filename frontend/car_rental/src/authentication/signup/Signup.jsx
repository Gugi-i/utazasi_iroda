import './Signup.css';
import React, { useState } from "react";
import {signup} from "../../services/authServices.js";
import Snackbar from "../../components/Snackbar.jsx";

function Signup({ onClose, onShowLogin }) {
    const [snackbar, setSnackbar] = useState({ show: false, message: '', type: '' });

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, show: false });
    };

    const confirmSignup = (event) => {
        event.preventDefault();

        const name = event.target.name.value;
        const email = event.target.email.value;
        const password = event.target.password.value;

        signup(name, email, password)
            .then(user => {
                setSnackbar({ show: true, message: 'Signup successful! Please login.', type: 'success' });

                setTimeout(() => {
                    onShowLogin();
                }, 1500);
            })
            .catch(err => {
                console.error('Signup error:', err);
                const errorMessage = "Signup failed. Please try again.";
                setSnackbar({ show: true, message: errorMessage, type: 'error' });
            });
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
                        <button type="button" className="close-btn" onClick={onClose}>Close</button>
                    </div>
                </form>
                <div className="sign-up-help">
                    <p>Already have an account? <span onClick={onShowLogin} className="link-text">Login</span></p>
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

export default Signup;
