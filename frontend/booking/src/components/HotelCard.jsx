import React from 'react';
import './HotelCard.css';

function HotelCard({ hotel, onBook }) {
    console.log('Rendering HotelCard for:', hotel);
    return (
        <div className="hotel-card">
            {/* Image Section
                Note: The new schema does not include an 'imageUrl'.
                A placeholder or the 'type' is displayed here instead.
            */}
            {/* Image Section */}

            <div className="hotel-card-image-wrapper">

                <img src={hotel.imageUrl} alt={hotel.name} className="hotel-card-img" />

                {hotel.badge && (

                    <span className="hotel-badge">{hotel.badge}</span>

                )}
            </div>

            {/* Content Section */}
            <div className="hotel-card-content">
                <div className="hotel-header">
                    <h3 className="hotel-name">{hotel.name}</h3>
                    <p className="hotel-location">
                        📍 {hotel.location}
                    </p>
                </div>

                {/* Description Section */}
                <p className="hotel-description" style={{ fontSize: '0.9rem', color: '#666', margin: '10px 0' }}>
                    {hotel.description}
                </p>

                {/* Room and Capacity Details */}
                <div className="hotel-amenities">
                    <span className="amenity-tag">Room: {hotel.room}</span>
                    <span className="amenity-tag">Capacity: {hotel.capacity} ppl</span>
                    <span className="amenity-tag">{hotel.type}</span>
                </div>

                <div className="hotel-footer">
                    <div className="price-container">
                        <span className="price-label">Price per night</span>
                        {/* Using 'price_per_night' from schema */}
                        <span className="price-amount">${hotel.price_per_night}</span>
                    </div>

                    {/* Passing the full accommodation object (including id) to onBook */}
                    <button
                        className="book-btn"
                        onClick={() => onBook(hotel)}
                        disabled={hotel.status !== 'Available'}
                    >
                        {hotel.status === 'Available' ? 'Book Now' : 'Unavailable'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HotelCard;
