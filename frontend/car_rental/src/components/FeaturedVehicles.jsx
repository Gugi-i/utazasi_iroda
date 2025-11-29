// components/FeaturedVehicles.js
import React, { useState } from 'react';
import './FeaturedVehicles.css';
import { bookCar } from "../services/bookingService"; // Removed checkCarAvailability
import CarCard from "./CarCard.jsx";
import '../App.css';
import Snackbar from "./Snackbar.jsx"; // Import Snackbar

function FeaturedVehicles({ searchResults, username, onRequestLogin, searchPickupDate, searchReturnDate, searchLocation, onRefreshCars }) {

    const [selectedCar, setSelectedCar] = useState(null);
    const [pickupDate, setPickupDate] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [termsChecked, setTermsChecked] = useState(false);
    const [location, setLocation] = useState("");

    // State for Snackbar
    const [snackbar, setSnackbar] = useState({ show: false, message: '', type: '' });

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, show: false });
    };

    const resetStates = () => {
        setSelectedCar(null);
        setPickupDate("");
        setReturnDate("");
        setTermsChecked(false);
        setLocation("");
    }

    const closeBookingModal = () => {
        resetStates();
        onRefreshCars();
    };

    const handleBooking = async () => {
        console.log("Handling booking...");

        // Basic Validation
        if (!pickupDate || !returnDate || !location) {
            setSnackbar({ show: true, message: "Please fill out all fields.", type: 'error' });
            return;
        }
        console.log("Terms checked:", termsChecked);
        if (!termsChecked) {
            console.log("Terms not accepted.");
            setSnackbar({ show: true, message: "You must accept the terms before booking.", type: 'error' });
            return;
        }

        try {
            console.log("Booking car:", selectedCar.id, pickupDate, returnDate);

            const result = await bookCar(
                selectedCar.id,
                pickupDate,
                returnDate
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

    const cars = searchResults || [];

    return (
        <section id="browse" className="featured-vehicles-section">
            <div className="container">

                <div className="car-list">
                    {cars.map(car => (
                        <CarCard key={car.id} car={car} onBook={() => {
                            if (!username) {
                                onRequestLogin();
                                return;
                            }
                            setSelectedCar(car);
                            setPickupDate(searchPickupDate || "");
                            setReturnDate(searchReturnDate || "");
                            setLocation(searchLocation || "");
                        }}
                        />
                    ))}
                </div>

                {/* Booking Modal */}
                {selectedCar && (
                    <div className="modal-overlay">
                        <div className="modal-panel">
                            <h2>Booking: {selectedCar.make} {selectedCar.model}</h2>

                            <p><strong>Price:</strong> ${selectedCar.price_per_day}/day</p>

                            <p><strong>Location:</strong> {location}</p>

                            <label>
                                Pickup date:
                                <input
                                    type="date"
                                    value={pickupDate}
                                    onChange={(e) => setPickupDate(e.target.value)}
                                />
                            </label>

                            <label>
                                Return date:
                                <input
                                    type="date"
                                    value={returnDate}
                                    onChange={(e) => setReturnDate(e.target.value)}
                                />
                            </label>

                            <label className="terms-checkbox">
                                <input
                                    type="checkbox"
                                    checked={termsChecked}
                                    onChange={(e) => setTermsChecked(e.target.checked)}
                                />
                                I accept the terms and conditions, and I understand that cancellations may require a fee
                                depending on timing.
                            </label>

                            {/* Removed the separate Availability Check row/button */}

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
            </div>

            {/* Render Snackbar globally for this component */}
            {snackbar.show && (
                <Snackbar
                    message={snackbar.message}
                    type={snackbar.type}
                    onClose={handleCloseSnackbar}
                />
            )}
        </section>
    );
}

export default FeaturedVehicles;
