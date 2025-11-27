import React from "react";
import './BookedTicketCard.css'; // new CSS file

function BookedTicketCard({ ticket, onDelete }) {

    const deleteTicket = () => {
        // Example backend call (replace with your real API)
        // fetch(`/api/tickets/${ticket.id}`, { method: 'DELETE' })
        //   .then(response => { if (response.ok) onDelete(); })
        //   .catch(err => console.error(err));

        console.log(`Deleting ticket with flight number: ${ticket.flight_number}`);
        onDelete();
    };

    // Format departure & arrival dates nicely
    const formatDateTime = (dt) => {
        const d = new Date(dt);
        return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    };

    return (
        <div className="plane-card">
            {/* Left: Airline Logo or placeholder image */}
            <div className="plane-card-img">
                <img src={ticket.airline_logo || '/placeholder-plane.png'} alt={ticket.airline} />
            </div>

            {/* Middle: Ticket Info */}
            <div className="plane-card-info">
                <h3>{ticket.airline}</h3>
                <p className="flight-number">Flight: {ticket.flight_number}</p>
                <p className="route">
                    {ticket.departure_city} → {ticket.arrival_city}
                </p>
                <p className="dates">
                    Departure: {formatDateTime(ticket.departure_date)} <br />
                    Arrival: {formatDateTime(ticket.arrival_date)}
                </p>
                <p className="seats">
                    Seats: {ticket.seats_available} / {ticket.total_seats}
                </p>
                <p className="price">Price: €{ticket.price}</p>
            </div>

            {/* Right: Action Button */}
            <button className="cancel-btn" onClick={deleteTicket}>
                Cancel
            </button>
        </div>
    );
}

export default BookedTicketCard;