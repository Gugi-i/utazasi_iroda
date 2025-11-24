import {useNavigate} from "react-router-dom";
import './Signup.css';

function Signup() {
    const navigate = useNavigate();

    const confirmSignup = () => {
        // API call to register user would go here
        let successfulSignup = true; // Simulating a successful login response
        if (successfulSignup) {
            navigate('/login');
        }
    };

    const navigateToLogin = () => {
        navigate('/login');
    }

    return (
        <div className="sign-up-page-wrapper">
            <div className="sign-up-container">
                <h2>Login to Airline Airlines</h2>
                <form className="sign-up-form">
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" required />
                    </div>

                    <button type="submit" className="sign-up-btn" onClick={confirmSignup}>Sign Up</button>
                </form>
                <div className="sign-up-help">
                    <a className="login-link" onClick={navigateToLogin}>Login</a>
                </div>
            </div>
        </div>
    );
}

export default Signup;
