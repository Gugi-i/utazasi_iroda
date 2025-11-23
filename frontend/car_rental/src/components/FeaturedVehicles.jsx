// components/FeaturedVehicles.js
import React, { useState } from 'react';
import './FeaturedVehicles.css'; // CSS for featured vehicles
import { checkCarAvailability, bookCar } from "../services/bookingService";
import CarCard from "./CarCard.jsx";
import '../App.css';


function FeaturedVehicles({ searchResults, searchError }) {

    const [selectedCar, setSelectedCar] = useState(null);
    const [pickupDate, setPickupDate] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [availabilityMessage, setAvailabilityMessage] = useState("");
    const [termsChecked, setTermsChecked] = useState(false);
    const [location, setLocation] = useState("");
    //TODO El kell dönteni, hogy ez kell-e
    const handleCheckAvailability = async () => {
        if (!pickupDate || !returnDate || !location) {
            setAvailabilityMessage("Please give required information.");
            return;
        }

        try {
            const result = await checkCarAvailability(selectedCar.id, pickupDate, returnDate, location);

            if (result) {
                setAvailabilityMessage("Car is available!");
            } else {
                setAvailabilityMessage(`Not available: ${result.reason}`);
            }
        } catch (error) {
            setAvailabilityMessage("Error checking availability. Please try again.");
        }
    };

    const handleBooking = async () => {
        if (!pickupDate || !returnDate || !location) {
            setAvailabilityMessage("Please fill out all fields.");
            return;
        }

        if (!termsChecked) {
            setAvailabilityMessage("You must accept the terms before booking.");
            return;
        }

        try {
            const result = await bookCar(
                selectedCar.id,
                pickupDate,
                returnDate,
                location
            );

            if (result) {
                setAvailabilityMessage("Booking successful! 🎉");
            } else {
                setAvailabilityMessage("Booking failed. Please try again.");
            }

        } catch (error) {
            setAvailabilityMessage("Error processing booking.");
            console.info(error);
        }
    };

    // Dummy data for featured cars
    const cars = searchResults || []; /*[
        { id: 1, name: 'Nissan Altima', pricePerDay: 50.00, imageUrl: 'src/assets/car2.jpg' },
        { id: 2, name: 'Toyota RAV4', pricePerDay: 65.00, imageUrl: 'src/assets/car3.jpg' },
        { id: 3, name: 'Fiat 500', pricePerDay: 40.00, imageUrl: 'src/assets/car1.jpg' },
        { id: 4, name: 'Honda Civic', pricePerDay: 55.00, imageUrl: 'src/assets/car4.jpg' },
        { id: 5, name: 'Ford Mustang', pricePerDay: 80.00, imageUrl: 'src/assets/car5.jpg' },
        { id: 6, name: 'Chevrolet Malibu', pricePerDay: 60.00, imageUrl: 'src/assets/car6.jpg' },
        // Add more cars as needed
    ];*/

    return (
        <section id="browse" className="featured-vehicles-section">
            <div className="container">
                <h2>Featured Vehicles</h2>
                {searchError && (
                    <p className="error-message">{searchError}</p>
                )}

                <div className="car-list">
                    {cars.map(car => (
                        <CarCard key={car.id} car={car}  onBook={setSelectedCar} />
                    ))}
                </div>
                 {selectedCar && (
                    <div className="modal-overlay">
                        <div className="modal-panel">
                        <h2>Booking: {selectedCar.name}</h2>

                        

                        <p><strong>Price:</strong> ${selectedCar.pricePerDay}/day</p>

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

                        <label>
                            Location:
                            <input
                                type="text"
                                placeholder="Enter pickup location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
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

                        <div className="availability-row">
                            <button
                                className="secondary-btn"
                                onClick={handleCheckAvailability}
                            >
                                Check Availability
                            </button>
                            {availabilityMessage && (
                                <span className="availability-message">{availabilityMessage}</span>
                            )}
                        </div>

                        <div className="button-row">
                            <button
                                className="primary-btn"
                                disabled={!termsChecked}
                                onClick={handleBooking}
                            >
                                Book Now
                            </button>

                            <button
                                className="close-btn"
                                onClick={() => {
                                    setSelectedCar(null);
                                    setPickupDate("");
                                    setReturnDate("");
                                    setAvailabilityMessage("");
                                    setTermsChecked(false);
                                    setLocation("")
                                }}
                            >
                                Close
                            </button>
                        </div>
                        </div>
                    </div>
                    )}
            </div>
        </section>
    );
}

export default FeaturedVehicles;
