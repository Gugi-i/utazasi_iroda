// ... all the imports
import './App.css';
import Header from "./components/Header.jsx";
import HeroSection from "./components/HeroSection.jsx";
import SearchBar from "./components/SearchBar.jsx";
import FeaturedVehicles from "./components/FeaturedVehicles.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import Footer from "./components/Footer.jsx";

function App() {
    return (
        <div className="car-rental-app">
            <Header />

            {/* This new 'main' element will be the one that grows */}
            <main className="main-content">
                <HeroSection />
                <SearchBar />
                <FeaturedVehicles />
                <HowItWorks />
            </main>

            <Footer />
        </div>
    );
}

export default App;
