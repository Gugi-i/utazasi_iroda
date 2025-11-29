// components/SearchBar.js
import React, { useState } from 'react';
import './SearchBar.css'; // CSS for the search bar

function SearchBar({ onSearch }) {
    const [pickupLocation, setPickupLocation] = useState('');
    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minSpace, setMinSpace] = useState('');

    const handleSearch = (e) => {
            e.preventDefault();

             if (!pickupLocation || !pickupDate || !returnDate) {
                onSearch({ error: "Location, pickup date and return date are required." });
                return;
            }
            onSearch({
                city: pickupLocation,
                start_date: pickupDate,
                end_date: returnDate,
                min_price: minPrice || undefined,
                max_price: maxPrice || undefined,
                min_space: minSpace || undefined,
                pickupDate,
                returnDate,
                location: pickupLocation
            });
        };

    return (
        <section className="search-bar-section">
            <div className="container">
            <form className="search-form" onSubmit={handleSearch}>

                {/* Required fields */}
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

                {/* Buttons stacked vertically */}
                <div className="search-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px' }}>
  <button type="submit" className="primary-btn">
    Search Cars
  </button>

  <button
    type="button"
    className="primary-btn"
    onClick={() => {
        setShowAdvanced(prev => !prev)
        setMinPrice('');
        setMaxPrice('');
        setMinSpace('');
    }}
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
