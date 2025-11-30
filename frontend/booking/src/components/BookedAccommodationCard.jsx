import React, { useState } from "react";
import './BookedAccommodationCard.css';
// import { cancelBookingApi } from '../services/bookingService';
import ConfirmationModal from './ConfirmationModal'; // Import the new modal

function BookedAccommodationCard({ booking, onDelete }) {
    // State to control modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Triggered when user clicks "Cancel" button on the card
    const handleInitialClick = () => {
        setIsModalOpen(true);
    };

    // Triggered when user confirms inside the modal
    const handleConfirmCancel = async () => {
        try {
            // Call the API service using the ID
            // await cancelBookingApi(booking.id);

            // Update UI only after successful API call
            if (onDelete) {
                onDelete(booking.id);
            }
        } catch (error) {
            alert("Failed to cancel booking. Please try again.");
        } finally {
            // Close the modal regardless of success/failure
            setIsModalOpen(false);
        }
    };

    // Triggered when user cancels/closes the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="booking-card">
                {/* Left: Image or Type Placeholder */}
                <div className="booking-card-img-wrapper">
                    {booking.imageUrl ? (
                        <img src={booking.imageUrl} alt={booking.name} className="booking-card-img" />
                    ) : (
                        <div className="booking-card-placeholder">
                            {booking.type}
                        </div>
                    )}
                </div>

                {/* Middle: Text Info */}
                <div className="booking-card-info">
                    <h3>{booking.name}</h3>

                    <p className="booking-dates">
                        {booking.check_in_date} — {booking.check_out_date}
                    </p>

                    <p className="booking-details">
                        {booking.room} • {booking.location}
                    </p>

                    <p className="booking-price">
                        Total: <span>${booking.total_price}</span>
                    </p>

                    <span className={`status-badge ${booking.status.toLowerCase()}`}>
                        {booking.status}
                    </span>
                </div>

                {booking.status === 'Confirmed' &&
                    <button
                        className="cancel-btn"
                        onClick={handleInitialClick} // Opens the modal instead of window.confirm
                        disabled={booking.status === 'Cancelled'}
                    >
                        Cancel
                    </button>
                }

            </div>

            {/* Render the Confirmation Modal */}
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmCancel}
                title="Cancel Booking?"
                message={`Are you sure you want to cancel your stay at ${booking.name}? This action cannot be undone.`}
            />
        </>
    );
}

export default BookedAccommodationCard;
