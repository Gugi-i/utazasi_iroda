import React, { useState } from "react";
import Header from "./Header.jsx";
import HeroSection from "./HeroSection.jsx";
import SearchBar from "./SearchBar.jsx";
import FeaturedVehicles from "./FeaturedVehicles.jsx";
import Footer from "./Footer.jsx";
import Snackbar from "../components/Snackbar.jsx";
import { searchCars } from "../services/searchService.js";
import './Home.css';

function Home() {

    const [searchResults, setSearchResults] = useState([]);
    const [searchError, setSearchError] = useState(null);

    const user = localStorage.getItem("user");
    const username = user ? JSON.parse(user).name : "";
    const [showLogin, setShowLogin] = useState(false);

    // Snackbar for critical errors
    const [snackbar, setSnackbar] = useState({ show: false, message: '', type: '' });

    // State for "No Results" message displayed in-page
    const [noCarsMessage, setNoCarsMessage] = useState("");

    const [searchPickupDate, setSearchPickupDate] = useState("");
    const [searchReturnDate, setSearchReturnDate] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [searchMinPrice, setSearchMinPrice] = useState("");
    const [searchMaxPrice, setSearchMaxPrice] = useState("");
    const [searchMinSpace, setSearchMinSpace] = useState("");

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, show: false });
    };

    const handleSearch = async (filters) => {
        setSearchPickupDate(filters.pickupDate);
        setSearchReturnDate(filters.returnDate);
        setSearchLocation(filters.location);
        setSearchMinPrice(filters.min_price || "");
        setSearchMaxPrice(filters.max_price || "");
        setSearchMinSpace(filters.min_space || "");

        // Reset previous states
        setNoCarsMessage("");
        setSearchResults([]);

        if (filters.error) {
            setSearchError(filters.error);
            setSnackbar({ show: true, message: filters.error, type: 'error' });
            return;
        }

        setSearchError(null);

        try {
            const results = await searchCars(filters);

            if (results.length === 0) {
                // Set the in-page message instead of opening a snackbar
                setNoCarsMessage("No cars found for the given search criteria. Please try different dates or filters.");
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

    const refreshCars = () => {
        handleSearch({
            city: searchLocation,
            start_date: searchPickupDate,
            end_date: searchReturnDate,
            min_price: searchMinPrice || undefined,
            max_price: searchMaxPrice || undefined,
            min_space: searchMinSpace || undefined,
            pickupDate: searchPickupDate,
            returnDate: searchReturnDate,
            location: searchLocation
        });
    }

    return (
        <div className="car-rental-app">
            <Header/>

            <main className="main-content">
                <HeroSection/>
                <SearchBar onSearch={handleSearch}/>

                {noCarsMessage ? (
                    <div className="no-results-container">
                        <h3>No Cars Found</h3>
                        <p>{noCarsMessage}</p>
                    </div>
                ) : (
                    <FeaturedVehicles
                        searchResults={searchResults}
                        username={username}
                        onRequestLogin={() => setShowLogin(true)}
                        searchPickupDate={searchPickupDate}
                        searchReturnDate={searchReturnDate}
                        searchLocation={searchLocation}
                        onRefreshCars={refreshCars}
                    />
                )}

            </main>

            <Footer/>

            {/* Only critical errors show here now */}
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
