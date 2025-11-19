import {useNavigate} from "react-router-dom";
import './Login.css';

function Login({ onLoginSuccess }) {
    const navigate = useNavigate();

    const confirmLogin = (event) => {
        event.preventDefault()
        // API call to authenticate user would go here
        let successfulLogin = true; // Simulating a successful login response
        if (successfulLogin) {
            navigate('/', { replace: true });
            onLoginSuccess(document.getElementById("email").value);
        }
    };

    const navigateToSignUp = () => {
        navigate('/sign-up');
    }

    return (
        <div className="login-page-wrapper">
            <div className="login-container">
                <h2>Login to Speedy Rentals</h2>
                <form className="login-form" onSubmit={confirmLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" required/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" required />
                    </div>

                    <button type="submit" className="login-btn">Login</button>
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
