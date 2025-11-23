// components/Header.js
import React, {useState} from 'react';
import './Header.css';
import Snackbar from '@mui/material/Snackbar';
import Login from "../authentication/login/Login.jsx";
import MyRentalsPage from "./MyRentalsPage.jsx";
import MuiAlert from '@mui/material/Alert';

/*function checkLoggedInUsername() {
    const storedUsername = localStorage.getItem("username");
    return storedUsername ? storedUsername : "";
} */

function Header({ username, setUsername, showLogin, setShowLogin }) {
    //const [username, setUsername] = useState(checkLoggedInUsername());
    //const [showLogin, setShowLogin] = React.useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    //const [open, setOpen] = useState(false);
    const [showMyRentals, setShowMyRentals] = useState(false);

    const handleLogin = (loggedInUsername) => {
        console.log("App received logged in username:", loggedInUsername);
        setUsername(loggedInUsername);
        localStorage.setItem("username", loggedInUsername);
        setShowLogin(false);
        //setOpen(true);
        setOpenSnackbar(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("username");
        setUsername("");
        window.location.reload();
    };

    const showLoginPage = () => {
        setShowLogin(true);
    };

    const closeLoginPage = () => {
        setShowLogin(false);
    }

    const showRentalsPage = () => {
        setShowMyRentals(true);
    }

    const closeRentalsPage = () => {
        setShowMyRentals(false);
    }

    return (
        <>
        <header className="header">
            <div className="container">
                <div className="logo">
                    <img src="../../src/assets/logo.png" alt="Speedy Rentals Logo" />
                    <span>SPEEDY RENTALS</span>
                </div>
                <nav className="nav-menu">
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#browse">Browse Cars</a></li>
                        <li><a href="#how-it-works">How It Works</a></li>
                        {username === "" ? (
                            <li>
                                <button className="sign-up-btn" id="login" onClick={showLoginPage}>Login</button>
                            </li>
                        ) : (
                            <li>
                                <a onClick={showRentalsPage} style={{cursor: "pointer"}}>My rentals</a>
                            </li>
                        )}
                        {username !== "" ?
                            (
                                <li>
                                    <button className="sign-up-btn" id="logout" onClick={() => {
                                        window.location.reload()
                                        localStorage.removeItem("username");
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
                    showLogin && <Login onLoginSuccess={handleLogin} onClose={closeLoginPage}/>
                }
            </div>
            <div>
                {
                    showMyRentals && <MyRentalsPage username={username} onClose={closeRentalsPage} />
                }
            </div>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    severity="success"
                    onClose={() => setOpenSnackbar(false)}
                >
                    Successful login! Welcome, {username}!
                </MuiAlert>
            </Snackbar>
            </>
    );
}


export default Header;
