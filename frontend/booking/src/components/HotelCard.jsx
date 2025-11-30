import React from 'react';
import './HotelCard.css';

function HotelCard({ hotel, onBook }) {
    // Fallback image if not provided
    const imageUrl = hotel.imageUrl || `https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80`;
    console.log(hotel)
    console.log(hotel.room)

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

                {/* Room Types List - This was likely the source of the error */}
                <div className="room-types-list">
                    <h4 className="room-types-title">Available Rooms:</h4>

                    {hotel.room_types && hotel.room_types.length > 0 ? (
                        hotel.room_types.map((room) => (
                            <div key={room.id} className="room-type-item">
                                <div className="room-info">
                                    {/* Render properties, NOT the 'room' object itself */}
                                    <span className="room-capacity">
                                        👤 {room.room_capacity} Person{room.room_capacity > 1 ? 's' : ''}
                                    </span>
                                </div>
                                <div className="room-action">
                                    <span className="room-price">${room.price_per_night}</span>
                                    <button
                                        className="book-room-btn"
                                        // Pass the specific room object to the handler
                                        onClick={() => onBook(hotel, room)}
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
