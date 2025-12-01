import Header from "./Header.jsx";
import HeroSection from "./HeroSection.jsx";
import SearchBar from "./SearchBar.jsx";
// import FeaturedVehicles from "./FeaturedVehicles.jsx";
// import HowItWorks from "./HowItWorks.jsx";
// import Footer from "./Footer.jsx";
// import { searchCars } from "../services/searchService.js";
import { useState } from "react";
import HotelList from "./HotelList.jsx";
import Snackbar from "../components/Snackbar.jsx";
import {searchAccommodations} from "../services/searchService.js";
import './Home.css';
import Footer from "./Footer.jsx";

function Home() {

    const [searchResults, setSearchResults] = useState([]);
    const [searchError, setSearchError] = useState(null);

    const user = localStorage.getItem("user");
    const userId = user ? JSON.parse(user).id : -1;
    const [showLogin, setShowLogin] = useState(false);

    const [snackbar, setSnackbar] = useState({ show: false, message: '', type: '' });

    const [noAccommodationsMessage, setNoAccommodationsMessage] = useState("");

    const [searchLocation, setSearchLocation] = useState("");
    const [searchMaxPrice, setSearchMaxPrice] = useState("");
    const [searchCheckInDate, setSearchCheckInDate] = useState("");
    const [searchCheckOutDate, setSearchCheckOutDate] = useState("");

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, show: false });
    };

    const handleSearch = async (filters) => {
        console.log("Search initiated with filters:", filters);
        setSearchCheckInDate(filters.check_in);
        setSearchCheckOutDate(filters.check_out);
        setSearchLocation(filters.location);
        setSearchMaxPrice(filters.max_price || "");

        setNoAccommodationsMessage("");
        setSearchResults([]);

        if (filters.error) {
            setSearchError(filters.error);
            setSnackbar({ show: true, message: filters.error, type: 'error' });
            return;
        }

        setSearchError(null);

        try {
            const results = await searchAccommodations(filters);

            if (results.length === 0) {
                console.log("No accommodations found for the given search criteria.");
                setNoAccommodationsMessage("No accommodations found for the given search criteria. Please try different dates or filters.");
            } else {
                setSearchResults(results);
            }

        } catch (e) {
            const msg = "Error contacting the server.";
            setSearchResults([]);
            setSearchError(msg);
            setSnackbar({ show: true, message: msg, type: 'error' });
        }
    };

    return (
        <div className="booking-app">
            <Header/>

            <main className="main-content">
                <HeroSection/>
                <SearchBar onSearch={handleSearch}/>
                {noAccommodationsMessage ? (
                    <div className="no-results-container">
                        <h3>No Accommodations Found</h3>
                        <p>{noAccommodationsMessage}</p>
                    </div>
                ) : (
                    <HotelList
                    searchResults={searchResults}
                    onRequestLogin={() => setSnackbar({
                        show: true,
                        message: "Please log in to book an accomodation.",
                        type: 'error'
                    })}
                    userId={userId}
                    searchCheckInDate={searchCheckInDate}
                    searchCheckOutDate={searchCheckOutDate}
                    />
                )}
                {/*<FeaturedVehicles searchResults={searchResults} searchError={searchError} />*/}
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
