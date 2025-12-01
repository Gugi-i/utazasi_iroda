import Header from "./Header.jsx";
import HeroSection from "./HeroSection.jsx";
import SearchBar from "./SearchBar.jsx";
import Tickets from "./Tickets.jsx";
import Footer from "./Footer.jsx";
import Snackbar from "../components/Snackbar.jsx";
import { searchTickets } from "../services/searchService.js";
import { useState } from "react";

function Home() {

    const [searchResults, setSearchResults] = useState([]);

    const user = localStorage.getItem("user");
    const userId = user ? JSON.parse(user).id : -1;

    // Removed [showLogin, setShowLogin] as it is no longer needed

    const [snackbar, setSnackbar] = useState({ show: false, message: '', type: '' });

    const [noTicketsMessage, setNoTicketsMessage] = useState("");

    const [searchDate, setSearchDate] = useState("");
    const [searchDestination, setSearchDestination] = useState("");
    const [searchStartLocation, setSearchStartLocation] = useState("")

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, show: false });
    };

    const handleSearch = async (filters) => {
        console.log(filters)
        setSearchDate(filters.date);
        setSearchDestination(filters.arrival_city);
        setSearchStartLocation(filters.departure_date)

        setNoTicketsMessage("");
        setSearchResults([]);

        if (filters.error) {console.log("here")
            setSnackbar({ show: true, message: filters.error, type: 'error' });
            return;
        }

        try {
            const results = await searchTickets(filters);
            setSearchResults(results);

            if (results.length === 0) {
                setNoTicketsMessage("No tickets found for the given search criteria. Please try different dates or filters.");
            }

        } catch (e) {
            const msg = "Error contacting the server.";
            setSearchResults([]);

            setSnackbar({ show: true, message: msg, type: 'error' });
        }
    };

    const refreshTickets = () => {
        // Note: Ensure departureCity, arrivalCity, and departureDate are defined in your state
        // or passed as arguments if you want this to work, as they are currently undefined in this scope.
        handleSearch({
            departure_city: searchStartLocation, // Assuming these map to your state variables
            arrival_city: searchDestination,
            departure_date: searchDate
        });
    }

    return (
        <div className="plane-ticket-app">
            <Header/>

            <main className="main-content">
                <HeroSection/>
                <SearchBar onSearch={handleSearch}/>
                {noTicketsMessage ? (
                    <div className="no-results-container">
                        <h3>No Tickets Found</h3>
                        <p>{noTicketsMessage}</p>
                    </div>
                ) : (
                    <Tickets
                        searchResults={searchResults}
                        userId={userId}
                        onRequestLogin={() => setSnackbar({
                            show: true,
                            message: "Please log in to book a ticket.",
                            type: 'error'
                        })}
                        searchDate={searchDate}
                        searchStartLocation={searchStartLocation}
                        searchDestination={searchDestination}
                        onRefreshTickets={refreshTickets}
                    />
                )}
            </main>

            <Footer/>
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

export default Home;
