import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch }) {
    const [date, setDate] = useState('');
    const [startLocation, setStartLocation] = useState("")
    const [destination, setDestination] = useState("");
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minSpace, setMinSpace] = useState('');

    const handleSearch = (e) => {
            e.preventDefault();

             if (!startLocation || !date || !destination) {
                onSearch({ error: "Date, starting location and destination are required." });
                return;
            }
            onSearch({
                starting_city: startLocation,
                destination: destination,
                date: date,
                min_price: minPrice || undefined,
                max_price: maxPrice || undefined,
                min_space: minSpace || undefined,
            });
        };

    return (
        <section className="search-bar-section">
            <div className="container">
            <form className="search-form" onSubmit={handleSearch}>
                <div className="input-group">
                <label htmlFor="start-location">From</label>
                <input
                    type="text"
                    id="start-location"
                    placeholder="Enter location"
                    value={startLocation}
                    onChange={(e) => setStartLocation(e.target.value)}
                />
                </div>

                <div className="input-group">
                <label htmlFor="destination-location">To</label>
                <input
                    type="text"
                    id="destination-location"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                />
                </div>

                <div className="input-group">
                <label htmlFor="flight-date">Return Date</label>
                <input
                    type="date"
                    id="flight-date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                </div>

                <div className="search-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px' }}>
                <button type="submit" className="primary-btn">
                    Search Tickets
                </button>

                <button
                    type="button"
                    className="primary-btn"
                    onClick={() => setShowAdvanced(prev => !prev)}
                >
                    {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
                </button>
                </div>

                {showAdvanced && (
                <div className="advanced-options" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <div className="input-group">
                    <label htmlFor="min-price">Min Price</label>
                    <input
                        type="number"
                        id="min-price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                    />
                    </div>

                    <div className="input-group">
                    <label htmlFor="max-price">Max Price</label>
                    <input
                        type="number"
                        id="max-price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                    </div>

                    <div className="input-group">
                    <label htmlFor="min-space">Min Space</label>
                    <input
                        type="number"
                        id="min-space"
                        value={minSpace}
                        onChange={(e) => setMinSpace(e.target.value)}
                    />
                    </div>
                </div>
                )}

            </form>
            </div>
        </section>
    );

}

export default SearchBar;