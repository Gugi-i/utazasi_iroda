import React, {useState} from 'react';
import './Header.css';
import Snackbar from '@mui/material/Snackbar';
import Login from "../authentication/login/Login.jsx";
import Signup from "../authentication/signup/Signup.jsx";
import MyTicketsPage from "./MyTicketsPage.jsx";
import MuiAlert from '@mui/material/Alert';

function checkLoggedInUser() {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedUserId = storedUser ? storedUser.id : null;
    return storedUserId ? storedUserId : -1;
}

function Header() {
    const [userId, setUserId] = useState(checkLoggedInUser());
    const [showLogin, setShowLogin] = React.useState(false);
    const [showSignUp, setShowSignUp] = React.useState(false);
    const [open, setOpen] = useState(false);
    const [showMyTickets, setShowMyTickets] = useState(false);

    const handleLogin = (loggedInUser) => {
        console.log("App received logged in usern:", loggedInUser);
        setUserId(loggedInUser);
        setShowLogin(false);
        setOpen(true);
    };

    const showLoginPage = () => {
        setShowLogin(true);
    };

    const closeLoginPage = () => {
        setShowLogin(false);
    }

    const showSignUpPage = () => {
        setShowSignUp(true);
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

    const showTicketsPage = () => {
        setShowMyTickets(true);
    }

    const closeTicketsPage = () => {
        setShowMyTickets(false);
    }

    return (
        <>
        <header className="header">
            <div className="container">
                <div className="logo">
                    <span>Guardian Air</span>
                </div>
                <nav className="nav-menu">
                    <ul>
                        {userId === -1 ? (
                            <li>
                                <button className="sign-up-btn" id="login" onClick={showLoginPage}>Login</button>
                            </li>
                        ) : (
                            <li>
                                <a onClick={showTicketsPage} style={{cursor: "pointer"}}>My Tickets</a>
                            </li>
                        )}
                        {userId !== -1 ?
                            (
                                <li>
                                    <button className="sign-up-btn" id="logout" onClick={() => {
                                        window.location.reload()
                                        localStorage.removeItem("user");
                                    }}>Logout</button>
                                </li>
                            ) : null
                        }
                    </ul>
                </nav>
            </div>
        </header>
            <div>
                {
                    showLogin && <Login onLoginSuccess={handleLogin} onClose={closeLoginPage} onShowSignUp={changeToSignUp}/>
                }
            </div>
            <div>
                {
                    showSignUp && <Signup onClose={closeSignUpPage} onShowLogin={changeToLogin} />
                }
            </div>
            <div>
                {
                    showMyTickets && <MyTicketsPage onClose={closeTicketsPage} />
                }
            </div>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={() => setOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
            <MuiAlert
                elevation={6}
                variant="filled"
                severity="success"
                onClose={() => setOpen(false)}
            >
                Successful login! Welcome!
            </MuiAlert>
            </Snackbar>
            </>
    );
}


export default Header;
