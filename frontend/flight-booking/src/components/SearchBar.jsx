// components/PlaneSearchBar.js
import React, { useState } from 'react';
import './SearchBar.css';

function PlaneSearchBar({ onSearch }) {
    const [departureCity, setDepartureCity] = useState('');
    const [arrivalCity, setArrivalCity] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();

        if (!departureCity || !arrivalCity || !departureDate) {
            onSearch({ error: "Departure city, arrival city, and departure date are required." });
            return;
        }

        onSearch({
            departure_city: departureCity,
            arrival_city: arrivalCity,
            departure_date: departureDate,
            return_date: returnDate || undefined,
            max_price: maxPrice || undefined
        });
    };

    return (
        <section className="search-bar-section">
            <div className="container">
                <form className="search-form" onSubmit={handleSearch}>

                    {/* Departure city */}
                    <div className="input-group">
                        <label>Departure City</label>
                        <input
                            type="text"
                            placeholder="e.g. London"
                            value={departureCity}
                            onChange={(e) => setDepartureCity(e.target.value)}
                        />
                    </div>

                    {/* Arrival city */}
                    <div className="input-group">
                        <label>Arrival City</label>
                        <input
                            type="text"
                            placeholder="e.g. Paris"
                            value={arrivalCity}
                            onChange={(e) => setArrivalCity(e.target.value)}
                        />
                    </div>

                    {/* Departure date */}
                    <div className="input-group">
                        <label>Departure Date</label>
                        <input
                            type="date"
                            value={departureDate}
                            onChange={(e) => setDepartureDate(e.target.value)}
                        />
                    </div>

                    <div className="search-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px' }}>
                        <button type="submit" className="primary-btn">
                            Search Flights
                        </button>
                    </div>

                </form>
            </div>
        </section>
    );
}

export default PlaneSearchBar;
