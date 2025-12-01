import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch }) {
    const [location, setLocation] = useState('');
    const [checkinDate, setCheckinDate] = useState('');
    const [checkoutDate, setCheckoutDate] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [maxPrice, setMaxPrice] = useState('');

    const handleSearch = (e) => {
        console.log('Search initiated with:');
        e.preventDefault();

        if (!location || !checkinDate || !checkoutDate) {
            console.log('Missing required fields');
            onSearch({ error: "Location, check-in date and check-out date are required." });
            return;
        }
        onSearch({
            location: location,
            check_in: checkinDate,
            check_out: checkoutDate,
            max_price: maxPrice || undefined,
        });
    };

    return (
        <section className="search-bar-section">
            <div className="container">
                <form className="search-form" onSubmit={handleSearch}>

                    <div className="input-group">
                        <label htmlFor="pickup-location">Location</label>
                        <input
                            type="text"
                            id="pickup-location"
                            placeholder="Enter location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="pickup-date">Check-in Date</label>
                        <input
                            type="date"
                            id="pickup-date"
                            value={checkinDate}
                            onChange={(e) => setCheckinDate(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="return-date">Check-out Date</label>
                        <input
                            type="date"
                            id="return-date"
                            value={checkoutDate}
                            onChange={(e) => setCheckoutDate(e.target.value)}
                        />
                    </div>

                    <div className="search-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px' }}>
                        <button type="submit" className="primary-btn">
                            Search Accommodations
                        </button>

                        <button
                            type="button"
                            className="primary-btn"
                            onClick={() => {
                                setShowAdvanced(prev => !prev)
                                setMaxPrice('');
                            }}
                        >
                            {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
                        </button>
                    </div>

                    {showAdvanced && (
                        <div className="advanced-options" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            {/*<div className="input-group">*/}
                            {/*    <label htmlFor="min-price">Min Price</label>*/}
                            {/*    <input*/}
                            {/*        type="number"*/}
                            {/*        id="min-price"*/}
                            {/*        value={minPrice}*/}
                            {/*        onChange={(e) => setMinPrice(e.target.value)}*/}
                            {/*    />*/}
                            {/*</div>*/}

                            <div className="input-group">
                                <label htmlFor="max-price">Max Price</label>
                                <input
                                    type="number"
                                    id="max-price"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                />
                            </div>

                            {/*<div className="input-group">*/}
                            {/*    <label htmlFor="min-space">Min Space</label>*/}
                            {/*    <input*/}
                            {/*        type="number"*/}
                            {/*        id="min-space"*/}
                            {/*        value={minSpace}*/}
                            {/*        onChange={(e) => setMinSpace(e.target.value)}*/}
                            {/*    />*/}
                            {/*</div>*/}
                        </div>
                    )}

                </form>
            </div>
        </section>
    );

}

export default SearchBar;
