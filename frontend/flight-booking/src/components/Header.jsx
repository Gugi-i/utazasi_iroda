import React, {useState} from 'react';
import './Header.css';
import Snackbar from '@mui/material/Snackbar';
import Login from "../authentication/login/Login.jsx";
import MyRentalsPage from "./MyTicketsPage.jsx";
import MuiAlert from '@mui/material/Alert';

function Header({ username, setUsername, showLogin, setShowLogin }) {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [showMyTickets, setShowMyTickets] = useState(false);

    const handleLogin = (loggedInUsername) => {
        console.log("App received logged in username:", loggedInUsername);
        setUsername(loggedInUsername);
        localStorage.setItem("username", loggedInUsername);
        setShowLogin(false);
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
                    <span>Airline Airlines</span>
                </div>
                <nav className="nav-menu">
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#browse">Browse Tickets</a></li>
                        {username === "" ? (
                            <li>
                                <button className="sign-up-btn" id="login" onClick={showLoginPage}>Login</button>
                            </li>
                        ) : (
                            <li>
                                <a onClick={showTicketsPage} style={{cursor: "pointer"}}>My Tickets</a>
                            </li>
                        )}
                        {username !== "" ?
                            (
                                <li>
                                    <button className="sign-up-btn" id="logout" onClick={handleLogout}
                                    >Logout</button>
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
                    showMyTickets && <MyRentalsPage username={username} onClose={closeTicketsPage} />
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
