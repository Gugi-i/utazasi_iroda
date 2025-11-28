import React, { useEffect, useRef, useState } from "react";
import './MyBookingsPage.css'; // Ensure CSS handles accommodation styles if needed
import '../App.css';
import BookedAccommodationCard from "./BookedAccommodationCard.jsx";
import { getBookingsApi } from "../services/bookingService.js"; // Import the service

function MyBookingsPage({ onClose }) {
    const modalRef = useRef(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState(null);     // Add error state

    // Close modal when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    // Fetch bookings on mount
    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const data = await getBookingsApi();
            setBookings(data);
            setError(null);
        } catch (err) {
            console.error("Failed to load bookings", err);
            setError("Failed to load your bookings. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (bookingIdToDelete) => {
        // Update local state to remove the item immediately from UI
        setBookings(prevBookings => prevBookings.filter(item => item.id !== bookingIdToDelete));
    };

    return (
        <div className="modal-overlay"> {/* modalRef moved to panel for correct outside click logic, usually overlay handles click */}
            <div className="modal-panel" style={{ width: "50%" }} ref={modalRef}>
                <button className="close-x" onClick={onClose}>✕</button>
                <h2>My Bookings</h2>

                {loading && <p>Loading your bookings...</p>}

                {error && <p className="error-message">{error}</p>}

                {!loading && !error && bookings.length === 0 && (
                    <p>You have no bookings at the moment.</p>
                )}

                <div className="bookings-list">
                    {bookings.map((booking) => (
                        <BookedAccommodationCard
                            key={booking.id}
                            booking={booking}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MyBookingsPage;
