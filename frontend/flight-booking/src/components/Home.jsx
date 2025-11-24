import Header from "./Header.jsx";
import HeroSection from "./HeroSection.jsx";
import SearchBar from "./SearchBar.jsx";
import FeaturedVehicles from "./Tickets.jsx";
import Footer from "./Footer.jsx";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { searchTickets } from "../services/searchService.js";
import { useState } from "react";

function Home() {

    const [searchResults, setSearchResults] = useState([]);
    const [username, setUsername] = useState(localStorage.getItem("username") || "");
    const [showLogin, setShowLogin] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const [searchDate, setSearchDate] = useState("");
    const [searchDestination, setSearchDestination] = useState("");

    const handleSearch = async (filters) => {
        setSearchDate(filters.Date);
        setSearchDestination(filters.Destination);
        if (filters.error) {
            setSearchResults([]);

            setSnackbarMessage(filters.error);
            setSnackbarOpen(true);
            return;
        }

        setSearchError(null);

        try {
            const results = await searchTickets(filters);
            setSearchResults(results);

            if (results.length === 0) {
                const msg = "No cars found for the given search.";
                setSearchError(msg);

                setSnackbarMessage(msg);
                setSnackbarOpen(true);
            }

        } catch (e) {
            const msg = "Error contacting the server.";
            setSearchResults([]);
            setSearchError(msg);

            setSnackbarMessage(msg);
            setSnackbarOpen(true);
        }
    };

    return (
        <div className="plane-ticket-app">
            <Header 
                username={username}
                setUsername={setUsername}
                showLogin={showLogin}
                setShowLogin={setShowLogin}
            />

            <main className="main-content">
                <HeroSection/>
                <SearchBar onSearch={handleSearch}/>
                <FeaturedVehicles
                    searchResults={searchResults}
                    username={username}
                    onRequestLogin={() => setShowLogin(true)}
                    searchDate={searchDate}
                    searchDestination={searchDestination}
                />
            </main>

            <Footer/>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    severity="error"
                    onClose={() => setSnackbarOpen(false)}
                >
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </div>
        
    );
}

export default Home;
