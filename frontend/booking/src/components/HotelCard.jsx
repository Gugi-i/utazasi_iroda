import React from 'react';
import './HotelCard.css';

function HotelCard({ hotel, onBook }) {
    // Fallback image based on ID or random if imageUrl is missing from backend
    const imageUrl = hotel.image_url || `https://picsum.photos/seed/${hotel.id}/400/300`;

    return (
        <div className="hotel-card">
            {/* Image Section */}
            <div className="hotel-card-image-wrapper">
                <img
                    src={imageUrl}
                    alt={hotel.name}
                    className="hotel-card-img"
                />
                <span className="hotel-badge">{hotel.type}</span>
            </div>

            {/* Content Section */}
            <div className="hotel-card-content">
                <div className="hotel-header">
                    <h3 className="hotel-name">{hotel.name}</h3>
                    <p className="hotel-location">
                        📍 {hotel.location}
                    </p>
                </div>

                <p className="hotel-description">
                    {hotel.description}
                </p>

                {/* Room Types List */}
                <div className="room-types-list">
                    <h4 className="room-types-title">Available Rooms:</h4>
                    {hotel.room_types && hotel.room_types.length > 0 ? (
                        hotel.room_types.map((room) => (
                            <div key={room.id} className="room-type-item">
                                <div className="room-info">
                                    <span className="room-capacity">
                                        👤 {room.room_capacity} Person{room.room_capacity > 1 ? 's' : ''}
                                    </span>
                                    {/* You could add total_rooms logic here if needed (e.g. "Only 2 left!") */}
                                </div>
                                <div className="room-action">
                                    <span className="room-price">${room.price_per_night}</span>
                                    <button
                                        className="book-room-btn"
                                        onClick={() => onBook(hotel, room)} // Pass both hotel and specific room
                                    >
                                        Select
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-rooms">No rooms available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HotelCard;
