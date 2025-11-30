import React, { useState } from 'react';
import HotelCard from './HotelCard';
// Ensure you have these or equivalent CSS files available for layout/modal styling
import './HotelList.css';
// You might need to adjust the path to your common App.css or similar
import '../App.css';
import Snackbar from "./Snackbar.jsx";
import {bookAccommodation} from "../services/bookingService.js"; // Import Snackbar
// import { bookAccommodation } from "../services/bookingService"; // Import your booking service

// Dummy data fallback is removed or kept as comment if preferred, using props
const dummyHotels = [];

function HotelList({ searchResults, username, onRequestLogin, searchCheckInDate, searchCheckOutDate }) {
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);

    // Booking Form States
    const [checkInDate, setCheckInDate] = useState(searchCheckInDate);
    const [checkOutDate, setCheckOutDate] = useState(searchCheckOutDate);
    const [termsChecked, setTermsChecked] = useState(false);

    // Snackbar State
    const [snackbar, setSnackbar] = useState({ show: false, message: '', type: '' });

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, show: false });
    };

    const resetStates = () => {
        setSelectedHotel(null);
        setSelectedRoom(null);
        setCheckInDate("");
        setCheckOutDate("");
        setTermsChecked(false);
    };

    const closeBookingModal = () => {
        resetStates();
        // Add onRefresh callback if needed later
    };

    const onBookClick = (hotel, room) => {
        if (!username) {
            console.log("User not logged in. Prompting login.");
            if (onRequestLogin) onRequestLogin();
            return;
        }
        setSelectedHotel(hotel);
        setSelectedRoom(room);

        setCheckInDate(searchCheckInDate || "");
        setCheckOutDate(searchCheckOutDate || "");
    };

    const handleBooking = async () => {

        if (!checkInDate || !checkOutDate) {
            setSnackbar({ show: true, message: "Please select check-in and check-out dates.", type: 'error' });
            return;
        }

        if (!termsChecked) {
            setSnackbar({ show: true, message: "You must accept the terms before booking.", type: 'error' });
            return;
        }

        try {
            console.log("Booking accommodation:" + selectedHotel.id + " Room Type ID: " + selectedRoom.id + " Check-in: " + checkInDate + " Check-out: " + checkOutDate);

            const result = await bookAccommodation(
                selectedHotel.id,
                selectedRoom.id,
                checkInDate,
                checkOutDate
            );

            if (result) {
                setSnackbar({ show: true, message: "Booking successful!", type: 'success' });
                setTimeout(() => {
                    closeBookingModal();
                }, 1500);
            } else {
                setSnackbar({ show: true, message: "Booking failed. Please try again.", type: 'error' });
            }

        } catch (error) {
            console.info(error);
            // Extract error message if available, or fallback
            const errorMsg = error.message || "Error processing booking.";
            setSnackbar({ show: true, message: errorMsg, type: 'error' });
        }
    };

    const accommodations = searchResults || dummyHotels;

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }} className="hotel-list-container">

            <div className="hotel-grid">
                {accommodations.map(hotel => (
                    <HotelCard key={hotel.id} hotel={hotel} onBook={onBookClick} />
                ))}
            </div>

            {/* Booking Modal */}
            {selectedRoom && selectedHotel && (
                <div className="modal-overlay">
                    <div className="modal-panel">
                        <h2>Booking: {selectedHotel.name}</h2>

                        <div className="booking-summary" style={{ marginBottom: '15px', padding: '10px', background: '#f9f9f9', borderRadius: '8px' }}>
                            <p style={{ margin: '5px 0' }}><strong>Location:</strong> {selectedHotel.location}</p>
                            <p style={{ margin: '5px 0' }}><strong>Room Capacity:</strong> {selectedRoom.room_capacity} Person(s)</p>
                            <p style={{ margin: '5px 0', color: '#007bff', fontSize: '1.1em' }}><strong>Price:</strong> ${selectedRoom.price_per_night}/night</p>
                        </div>

                        <label>
                            Check-in Date:
                            <input
                                type="date"
                                value={checkInDate}
                                onChange={(e) => setCheckInDate(e.target.value)}
                            />
                        </label>

                        <label>
                            Check-out Date:
                            <input
                                type="date"
                                value={checkOutDate}
                                onChange={(e) => setCheckOutDate(e.target.value)}
                            />
                        </label>

                        <label className="terms-checkbox">
                            <input
                                type="checkbox"
                                checked={termsChecked}
                                onChange={(e) => setTermsChecked(e.target.checked)}
                            />
                            I accept the terms and conditions, and I understand that cancellations may require a fee depending on timing.
                        </label>

                        <div className="button-row">
                            <button
                                className="primary-btn"
                                onClick={handleBooking}
                            >
                                Book Now
                            </button>

                            <button
                                className="close-btn"
                                onClick={resetStates}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Render Snackbar */}
            {snackbar.show && (
                <Snackbar
                    message={snackbar.message}
                    type={snackbar.type}
                    onClose={handleCloseSnackbar}
                />
            )}
        </div>
    );
}

export default HotelList;
