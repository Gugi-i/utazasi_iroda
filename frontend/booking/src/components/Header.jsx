// components/Header.js
import React, {useState} from 'react';
import './Header.css';
import Snackbar from '@mui/material/Snackbar';
import Login from "../authentication/login/Login.jsx";
import Signup from "../authentication/signup/Signup.jsx";
// import MyBookingsPage from "./MyBookingsPage.jsx";
import MuiAlert from '@mui/material/Alert';
import MyBookingsPage from "./MyBookingsPage.jsx";

function checkLoggedInUser() {
    const storedUser = localStorage.getItem("user");
    const storedUserId = storedUser ? JSON.parse(storedUser).id : null;
    return storedUserId ? storedUserId : -1;
}

function Header() {
    const [userId, setUserId] = useState(checkLoggedInUser());
    const [showLogin, setShowLogin] = React.useState(false  );
    const [showSignUp, setShowSignUp] = React.useState(false);
    const [open, setOpen] = useState(false);
    const [showMyBookings, setShowMyBookings] = useState(false);

    const handleLogin = (loggedInUserId) => {
        console.log("App received logged in user id:", loggedInUserId);
        setUserId(loggedInUserId);
        setShowLogin(false);
        setOpen(true);
    };

    const showLoginPage = () => {
        setShowLogin(true);
    };

    const closeLoginPage = () => {
        setShowLogin(false);
    }

    const closeSignUpPage = () => {
        setShowSignUp(false);
    }

    const changeToSignUp = () => {
        setShowLogin(false);
        setShowSignUp(true);
    }

    const changeToLogin = () => {
        setShowSignUp(false);
        setShowLogin(true);
    }

    const showBookingsPage = () => {
        setShowMyBookings(true);
    }

    const closeBookingsPage = () => {
        setShowMyBookings(false);
    }

    return (
        <>
            <header className="header">
                <div className="container">
                    <div className="logo">
                        <img src="../../src/assets/logo.png" alt="Stay Sure Logo"/>
                        <span>STAY SURE</span>
                    </div>
                    <nav className="nav-menu">
                        <ul>
                            {userId === -1 ? (
                                <li>
                                    <button className="sign-up-btn" id="login" onClick={showLoginPage}>Login</button>
                                </li>
                            ) : (
                                <li>
                                    <a onClick={showBookingsPage} style={{cursor: "pointer"}}>My bookings</a>
                                </li>
                            )}
                            {userId !== -1 ?
                                (
                                    <li>
                                        <button className="sign-up-btn" id="logout" onClick={() => {
                                            window.location.reload()
                                            localStorage.removeItem("user");
                                        }}>Logout
                                        </button>
                                    </li>
                                ) : null
                            }
                        </ul>
                    </nav>
                </div>
            </header>
            <div>
                {
                    showLogin &&
                    <Login onLoginSuccess={handleLogin} onClose={closeLoginPage} onShowSignUp={changeToSignUp}/>
                }
            </div>
            <div>
                {
                    showSignUp && <Signup onClose={closeSignUpPage} onShowLogin={changeToLogin}/>
                }
            </div>
            <div>
                {
                    showMyBookings && <MyBookingsPage onClose={closeBookingsPage}/>
                }
            </div>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={() => setOpen(false)}
                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    severity="success" // gives green color
                    onClose={() => setOpen(false)}
                >
                    Successful login! Welcome!
                </MuiAlert>
            </Snackbar>
        </>
    );
}


export default Header;
