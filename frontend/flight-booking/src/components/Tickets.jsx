import React, { useState } from 'react';
import './Tickets.css';
import { bookTicket } from "../services/bookingService";
import TicketCard from "./TicketCard.jsx";
import '../App.css';


function Tickets({ searchResults, username, onRequestLogin, searchDate, searchStartLocation, searchDestination }) {

    const [selectedTicket, setSelectedTicket] = useState(null);
    const [date, setDate] = useState("");
    const [availabilityMessage, setAvailabilityMessage] = useState("");
    const [termsChecked, setTermsChecked] = useState(false);
    const [startLocation, setStartLocation] = useState("")
    const [destination, setDestination] = useState("");
    const [quantity, setQuantity] = useState(1);

    const handleBooking = async () => {
        if (!termsChecked) {
            setAvailabilityMessage("You must accept the terms to proceed.");
            return;
        }

        if (quantity < 1) {
            setAvailabilityMessage("Select at least 1 seat.");
            return;
        }

        try {
            await bookTicket({
                ticketId: selectedTicket.id,
                userId: username.id,
                quantity: quantity
            });

            setAvailabilityMessage("Booking successful!");

            setSelectedTicket(null);
        } catch (err) {
            setAvailabilityMessage(err.message || "Booking failed.");
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

                            <h2>Booking: {selectedTicket.airline} {selectedTicket.flight_number}</h2>

                            <p><strong>From:</strong> {selectedTicket.departure_city}</p>
                            <p><strong>To:</strong> {selectedTicket.arrival_city}</p>

                            <p><strong>Price per seat:</strong> €{selectedTicket.price}</p>

                            <label>
                                Number of seats:
                                <input
                                    type="number"
                                    min="1"
                                    max={selectedTicket.seats_available}
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                                />
                            </label>

                            <label className="terms-checkbox">
                                <input
                                    type="checkbox"
                                    checked={termsChecked}
                                    onChange={(e) => setTermsChecked(e.target.checked)}
                                />
                                I accept the terms.
                            </label>

                            {availabilityMessage && (
                                <p className="booking-error">{availabilityMessage}</p>
                            )}

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
                                    onClick={() => { setSelectedTicket(null); }}
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
