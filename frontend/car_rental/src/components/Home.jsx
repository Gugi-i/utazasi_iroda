import Header from "./Header.jsx";
import HeroSection from "./HeroSection.jsx";
import SearchBar from "./SearchBar.jsx";
import FeaturedVehicles from "./FeaturedVehicles.jsx";
import HowItWorks from "./HowItWorks.jsx";
import Footer from "./Footer.jsx";
import { searchCars } from "../services/searchService.js";
import { useState } from "react";

function Home() {

    const [searchResults, setSearchResults] = useState([]);
    const [searchError, setSearchError] = useState(null);

    const handleSearch = async (filters) => {

        if (filters.error) {
            setSearchResults([]);
            setSearchError(filters.error);
            return;
        }

        setSearchError(null);

        try {
            const results = await searchCars(filters);
            setSearchResults(results);

            if (results.length === 0) {
                setSearchError("No cars found for the given search.");
            }

        } catch (e) {
            setSearchResults([]);
            setSearchError("Error contacting the server.");
        }
    };

    return (
        <div className="car-rental-app">
            <Header/>

            <main className="main-content">
                <HeroSection/>
                <SearchBar onSearch={handleSearch}/>
                <FeaturedVehicles searchResults={searchResults} searchError={searchError} />
                <HowItWorks/>
            </main>

            <Footer/>
        </div>
    );
}

export default Home;
