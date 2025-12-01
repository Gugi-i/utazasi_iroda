import React from 'react';
import './HotelCard.css';

function HotelCard({ hotel, onBook }) {
    const imageUrl = hotel.imageUrl || `https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80`;
    console.log(hotel)
    console.log(hotel.room)

    return (
        <div className="hotel-card">
            <div className="hotel-card-image-wrapper">
                <img
                    src={imageUrl}
                    alt={hotel.name}
                    className="hotel-card-img"
                />
                <span className="hotel-badge">{hotel.type}</span>
            </div>

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

                <div className="room-types-list">
                    <h4 className="room-types-title">Available Rooms:</h4>

                    {hotel.room_types && hotel.room_types.length > 0 ? (
                        hotel.room_types.map((room) => (
                            <div key={room.id} className="room-type-item">
                                <div className="room-info">
                                    <span className="room-capacity">
                                        👤 {room.room_capacity} Person{room.room_capacity > 1 ? 's' : ''}
                                    </span>
                                </div>
                                <div className="room-action">
                                    <span className="room-price">${room.price_per_night}</span>
                                    <button
                                        className="book-room-btn"
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
