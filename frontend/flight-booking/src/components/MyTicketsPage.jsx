import React, { useEffect, useRef, useState } from "react";
import './MyTicketsPage.css';
import BookedTicketCard from "./BookedTicketCard.jsx"; // <-- use your renamed component

function MyTicketsPage({ username, onClose }) {
    const modalRef = useRef(null);
    const [tickets, setTickets] = useState([]);

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target) && typeof onClose === 'function') {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    // Mock tickets for now; replace with real API fetch
    useEffect(() => {
        const mockTickets = [
            {
                id: 1,
                airline: "Airline Airlines",
                flight_number: "AA123",
                departure_city: "New York",
                arrival_city: "London",
                departure_date: "2024-12-01T10:00:00",
                arrival_date: "2024-12-01T18:00:00",
                price: 450,
                total_seats: 150,
                seats_available: 5,
                airline_logo: "/placeholder-plane.png"
            },
            {
                id: 2,
                airline: "SkyHigh",
                flight_number: "SH456",
                departure_city: "Paris",
                arrival_city: "Berlin",
                departure_date: "2024-12-05T08:30:00",
                arrival_date: "2024-12-05T10:15:00",
                price: 120,
                total_seats: 100,
                seats_available: 12,
                airline_logo: "/placeholder-plane.png"
            }
        ];

        setTickets(mockTickets);
    }, []);

    const handleDelete = (ticketToDelete) => {
        // Optional: call backend API to cancel ticket
        setTickets(tickets.filter(t => t.id !== ticketToDelete.id));
    };

    return (
        <div className="modal-overlay" style={{ background: "rgba(0,0,0,0.3)" }}>
            <div className="modal-panel" ref={modalRef} style={{ width: "60%" }}>
                <button className="close-x" onClick={onClose}>✕</button>
                <h2>My Tickets</h2>

                {tickets.length === 0 ? (
                    <p>You have no tickets at the moment.</p>
                ) : (
                    tickets.map(ticket => (
                        <BookedTicketCard
                            key={ticket.id}
                            ticket={ticket}       // pass ticket object
                            onDelete={() => handleDelete(ticket)} // delete callback
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default MyTicketsPage;
