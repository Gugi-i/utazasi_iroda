// components/SearchBar.js
import React, { useState } from 'react';
import './SearchBar.css'; // CSS for the search bar

function SearchBar() {
    const [pickupLocation, setPickupLocation] = useState('');
    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        // In a real app, you'd send these values to an API or another component
        console.log({ pickupLocation, pickupDate, returnDate });
        alert('Searching for cars!');
    };

    return (
        <section className="search-bar-section">
            <div className="container">
                <form className="search-form" onSubmit={handleSearch}>
                    <div className="input-group">
                        <label htmlFor="pickup-location">Pickup Location</label>
                        <input
                            type="text"
                            id="pickup-location"
                            placeholder="Enter location"
                            value={pickupLocation}
                            onChange={(e) => setPickupLocation(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="pickup-date">Pickup Date</label>
                        <input
                            type="date"
                            id="pickup-date"
                            value={pickupDate}
                            onChange={(e) => setPickupDate(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="return-date">Return Date</label>
                        <input
                            type="date"
                            id="return-date"
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="search-button">Search Cars</button>
                </form>
            </div>
        </section>
    );
}

export default SearchBar;
