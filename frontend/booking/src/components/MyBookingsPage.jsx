import React, { useEffect, useRef, useState } from "react";
import './MyBookingsPage.css';
import '../App.css';
import BookedAccommodationCard from "./BookedAccommodationCard.jsx";
import Snackbar from "../components/Snackbar.jsx";
import { deleteAccommodation, getAccommodationsForUser } from "../services/bookingService.js";

function MyBookingsPage({ onClose }) {
    const modalRef = useRef(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ show: false, message: '', type: '' });

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

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, show: false });
    };

    const getAccomodations = () => {
        setLoading(true);
        getAccommodationsForUser()
            .then(data => {
                console.log("API Data:", data);

                const mappedBookings = data.map(booking => {
                    // --- 1. Date Formatting Logic ---
                    // Assumes input is YYYY-MM-DD. Replaces '-' with '.' and adds a trailing dot.
                    const formatDate = (dateStr) => {
                        if (!dateStr) return "";
                        return dateStr.replace(/-/g, '.') + '.';
                    };

                    const formattedCheckIn = formatDate(booking.check_in_date);
                    const formattedCheckOut = formatDate(booking.check_out_date);

                    // --- 2. Status Calculation Logic ---
                    const calculateStatus = (apiStatus, startStr, endStr) => {
                        // If API explicitly says cancelled, keep it.
                        if (apiStatus && apiStatus.toLowerCase() === 'cancelled') {
                            return 'Cancelled';
                        }

                        const today = new Date();
                        today.setHours(0, 0, 0, 0); // Reset time for accurate date comparison

                        const startDate = new Date(startStr);
                        const endDate = new Date(endStr);

                        if (today > endDate) {
                            return 'Completed';
                        } else if (today >= startDate && today <= endDate) {
                            return 'Ongoing';
                        } else {
                            return 'Confirmed'; // Or 'Upcoming'
                        }
                    };

                    const computedStatus = calculateStatus(
                        booking.status,
                        booking.check_in_date,
                        booking.check_out_date
                    );

                    return {
                        id: booking.id,
                        name: booking.name || "Unknown Accommodation",
                        location: booking.location || "Unknown Location",
                        room: booking.room_type || "Standard Room",

                        // Use the formatted date strings
                        check_in_date: formattedCheckIn,
                        check_out_date: formattedCheckOut,

                        total_price: booking.total_price,

                        // Use the calculated status
                        status: computedStatus,

                        // Handle Image: Fallback if API doesn't provide one
                        imageUrl: booking.image_url || `src/assets/room${(booking.id % 5) + 1}.jpg`
                    };
                });

                setBookings(mappedBookings);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching bookings:', error);
                setError("Failed to load bookings.");
                setSnackbar({ show: true, message: 'Failed to load bookings.', type: 'error' });
                setLoading(false);
            });
    }

    useEffect(() => {
        getAccomodations();
    }, []);

    const handleDelete = (bookingId) => {
        deleteAccommodation(bookingId)
            .then(() => {
                setSnackbar({ show: true, message: 'Booking cancelled successfully!', type: 'success' });
                // Refresh the list to recalculate statuses/remove items
                getAccomodations();
            })
            .catch((error) => {
                console.error('Error deleting booking:', error);
                setSnackbar({ show: true, message: 'Failed to cancel booking. Please try again.', type: 'error' });
            });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-panel" style={{ width: "50%" }} ref={modalRef}>
                <button className="close-x" onClick={onClose}>✕</button>
                <h2>My Bookings</h2>

                {loading && <p className="loading-message">Loading your bookings...</p>}

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

                {snackbar.show && (
                    <Snackbar
                        message={snackbar.message}
                        type={snackbar.type}
                        onClose={handleCloseSnackbar}
                    />
                )}
            </div>
        </div>
    );
}

export default MyBookingsPage;
