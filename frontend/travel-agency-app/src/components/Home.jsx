// Home.jsx
import React, { useState } from "react";
import Login from "../authentication/login/Login.jsx";
import MainContent from "./MainContent.jsx";
import ViewJourney from "./ViewJourney.jsx"; // Import the new component
import Header from "../components/Header.jsx"; // Import Header
import Snackbar from "../components/Snackbar.jsx";
// import './Home.css';

function Home() {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    console.log("Current user in Home:", user);

    const [authSnackbar, setAuthSnackbar] = useState({ show: false, message: '', type: '' });

    // 1. New State to track the current view ('plan' or 'view')
    const [currentView, setCurrentView] = useState('plan');

    const handleLoginSuccess = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setAuthSnackbar({ show: true, message: `Welcome back!`, type: 'success' });
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        setCurrentView('plan'); // Reset view on logout
    };

    const handleCloseSnackbar = () => {
        setAuthSnackbar({ ...authSnackbar, show: false });
    };

    if (!user) {
        return (
            <div className="login-page-container">
                <Login onLoginSuccess={handleLoginSuccess} />
                {authSnackbar.show && (
                    <Snackbar
                        message={authSnackbar.message}
                        type={authSnackbar.type}
                        onClose={handleCloseSnackbar}
                    />
                )}
            </div>
        );
    }

    return (
        <>
            {/* 2. Pass currentView and the handler to Header */}
            <Header
                activeTab={currentView}
                onNavigate={(view) => setCurrentView(view)}
            />

            {/* 3. Conditional Rendering based on currentView */}
            {currentView === 'plan' ? (
                <MainContent user={user} onLogout={handleLogout} />
            ) : (
                <ViewJourney user={user} />
            )}

            {authSnackbar.show && (
                <Snackbar
                    message={authSnackbar.message}
                    type={authSnackbar.type}
                    onClose={handleCloseSnackbar}
                />
            )}
        </>
    );
}

export default Home;
