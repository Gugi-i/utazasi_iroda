import React, { useState } from "react";
import './BookedAccommodationCard.css';
import ConfirmationModal from './ConfirmationModal';

function BookedAccommodationCard({ booking, onDelete }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleInitialClick = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleConfirmCancel = async () => {
        try {
            if (onDelete) {
                onDelete(booking.id);
            }
        } catch (error) {
            alert("Failed to cancel booking. Please try again.");
        } finally {
            setIsModalOpen(false);
        }
    };

    const bookingStatus = booking.status || 'Confirmed';
    const hotelName = booking.name || `Booking #${booking.id}`;
    const location = booking.location || 'Unknown Location';
    const roomName = booking.room || `Room Type ${booking.room_type_id}`;
    const imageUrl = booking.imageUrl;

    const checkIn = booking.check_in_date ? booking.check_in_date.toString().split('T')[0] : 'N/A';
    const checkOut = booking.check_out_date ? booking.check_out_date.toString().split('T')[0] : 'N/A';

    return (
        <>
            <div className="booking-card">
                <div className="booking-card-img-wrapper">
                    {imageUrl ? (
                        <img src={imageUrl} alt={hotelName} className="booking-card-img" />
                    ) : (
                        <div className="booking-card-placeholder">
                            <span className="placeholder-icon">🏨</span>
                        </div>
                    )}
                </div>

                <div className="booking-card-info">
                    <div className="booking-header">
                        <h3 className="hotel-name">{hotelName}</h3>
                        <span className={`status-badge status-${bookingStatus.toLowerCase()}`}>
                            {bookingStatus}
                        </span>
                    </div>

                    <div className="booking-details-grid">
                        <div className="detail-item">
                            <span className="detail-label">Dates</span>
                            <span className="detail-value">{checkIn} - {checkOut}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Room</span>
                            <span className="detail-value">{roomName}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Location</span>
                            <span className="detail-value">{location}</span>
                        </div>
                        <div className="detail-item price-item">
                            <span className="detail-label">Total</span>
                            <span className="detail-value price">${booking.total_price}</span>
                        </div>
                    </div>
                </div>

                <div className="booking-card-actions">
                    {bookingStatus === 'Confirmed' && (
                        <button
                            className="cancel-btn"
                            onClick={handleInitialClick}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmCancel}
                title="Cancel Booking?"
                message={`Are you sure you want to cancel your stay at ${hotelName}? This action cannot be undone.`}
            />
        </>
    );
}

export default BookedAccommodationCard;
