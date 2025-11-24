import React, { useState } from 'react';
import './Tickets.css';
import { checkTicketAvailability, bookTicket } from "../services/bookingService";
import TicketCard from "./TicketCard.jsx";
import '../App.css';


function Tickets({ searchResults, username, onRequestLogin, searchDate, searchStartLocation, searchDestination }) {

    const [selectedTicket, setSelectedTicket] = useState(null);
    const [date, setDate] = useState("");
    const [availabilityMessage, setAvailabilityMessage] = useState("");
    const [termsChecked, setTermsChecked] = useState(false);
    const [startLocation, setStartLocation] = useState("")
    const [destination, setDestination] = useState("");

    const handleCheckAvailability = async () => {
        if (!date || !startLocation || !destination) {
            setAvailabilityMessage("Please give required information.");
            return;
        }

        try {
            const result = await checkTicketAvailability(selectedTicket.id, date, startLocation, destination);

            if (result) {
                setAvailabilityMessage("Ticket is available!");
            } else {
                setAvailabilityMessage(`Not available: ${result.reason}`);
            }
        } catch (error) {
            setAvailabilityMessage("Error checking availability. Please try again.");
        }
    };

    const handleBooking = async () => {
        if (!date || !startLocation || !destination) {
            setAvailabilityMessage("Please fill out all fields.");
            return;
        }

        if (!termsChecked) {
            setAvailabilityMessage("You must accept the terms before booking.");
            return;
        }

        try {
            const result = await bookTicket(
                selectedTicket.id,
                date,
                startLocation,
                destination
            );

            if (result) {
                setAvailabilityMessage("Booking successful!");
            } else {
                setAvailabilityMessage("Booking failed. Please try again later.");
            }

        } catch (error) {
            setAvailabilityMessage("Error processing booking.");
            console.info(error);
        }
    };
    const tickets = searchResults || [];

    return (
        <section id="browse" className="featured-tickets-section">
            <div className="container">

                <div className="ticket-list">
                    {tickets.map(ticket => (
                        <TicketCard key={ticket.id} ticket={ticket}  onBook={() => {
                                if (!username) {
                                    onRequestLogin();
                                    return;
                                }
                                setSelectedTicket(ticket);
                                setDate(searchDate || "");
                                setStartLocation(searchStartLocation)
                                setDestination(searchDestination || "");
                            }}  
                        />
                    ))}
                </div>
                 {selectedTicket && (
                    <div className="modal-overlay">
                        <div className="modal-panel">
                        <h2>Booking: {selectedTicket.name}</h2>

                        <p><strong>Price:</strong> ${selectedTicket.price}</p>

                        <label>
                            Date:
                            <input 
                                type="date" 
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </label>

                        <label>
                            From:
                            <input
                                type="text"
                                placeholder="Enter starting city"
                                value={startLocation}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </label>

                        <label>
                            To:
                            <input
                                type="text"
                                placeholder="Enter destination city"
                                value={destination}
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
                                    setSelectedTicket(null);
                                    setDate("");
                                    setAvailabilityMessage("");
                                    setTermsChecked(false);
                                    setStartLocation("")
                                    setDestination("")
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

export default Tickets;
