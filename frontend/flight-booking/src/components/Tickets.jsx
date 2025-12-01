import React, { useState } from 'react';
import './Tickets.css';
import { bookTicket } from "../services/bookingService";
import TicketCard from "./TicketCard.jsx";
import '../App.css';
import Snackbar from "./Snackbar.jsx";


function Tickets({ searchResults, userId, onRequestLogin, searchDate, searchStartLocation, searchDestination }) {

    const [selectedTicket, setSelectedTicket] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [termsChecked, setTermsChecked] = useState(false);

    const [snackbar, setSnackbar] = useState({ show: false, message: '', type: '' });

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, show: false });
    };

    const resetStates = () => {
        setSelectedTicket(null);
        setDate("");
        setStartLocation("");
        setTermsChecked(false);
        setDestination("");
    }

    const closeBookingModal = () => {
        resetStates();
        onRefreshTickets
        ();
    };

    const handleBooking = async () => {
        if (!termsChecked) {
            setSnackbar({ show: true, message: "You must accept the terms before booking.", type: 'error' });
            return;
        }

        if (quantity < 1) {
            setSnackbar({ show: true, message: "Select at least 1 seat.", type: 'error' });
            return;
        }

        try {
            const result = await bookTicket({
                flight_id: selectedTicket.id,
                quantity
            });

        if (result) {
                setSnackbar({ show: true, message: "Booking successful!", type: 'success' });
                setTimeout(() => {
                    closeBookingModal();
                }, 1500);
            } else {
                setSnackbar({ show: true, message: "Booking failed. Please try again.", type: 'error' });
            }
        } catch (error) {
            const errorMsg = error.message || "Error processing booking.";
            setSnackbar({ show: true, message: errorMsg, type: 'error' });
        }
    };

    const tickets = searchResults || [];

    return (
        <section id="browse" className="featured-tickets-section">
            <div className="container">

                <div className="ticket-list">
                    {tickets.map(ticket => (
                        <TicketCard key={ticket.id} ticket={ticket}  onBook={() => {
                            console.log(userId)
                                if (userId === -1) {
                                    onRequestLogin();
                                    return;
                                }
                                setSelectedTicket(ticket);
                                setDate(searchDate || "");
                                setStartLocation(searchStartLocation || "")
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
                                    onClick={resetStates}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>

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

export default Tickets;
