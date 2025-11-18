import Header from "./Header.jsx";
import HeroSection from "./HeroSection.jsx";
import SearchBar from "./SearchBar.jsx";
import FeaturedVehicles from "./FeaturedVehicles.jsx";
import HowItWorks from "./HowItWorks.jsx";
import Footer from "./Footer.jsx";

function Home({ username }) {
    return (
        <div className="car-rental-app">
            <Header username={username}/>

            <main className="main-content">
                <HeroSection/>
                <SearchBar/>
                <FeaturedVehicles/>
                <HowItWorks/>
            </main>

            <Footer/>
        </div>
    );
}

export default Home;
