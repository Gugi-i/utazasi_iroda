import React from "react";
import './BookedTicketCard.css'; // new CSS file

function BookedTicketCard({ ticket, onDelete }) {

    const formatDateTime = (dt) => {
        const d = new Date(dt);
        return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    };

    return (
        <div className="plane-card">
            <div className="plane-card-info">
                <h3>{ticket.airline || "Unknown Airline"}</h3>
                <p>Flight: {ticket.flight_number || "N/A"}</p>
                <p>{ticket.departure_city || "?"} → {ticket.arrival_city || "?"}</p>
                <p>Departure: {ticket.departure_date || "N/A"}</p>
                <p>Arrival: {ticket.arrival_date || "N/A"}</p>
                <p>Price: €{ticket.price}</p>
            </div>

            <button className="cancel-btn" onClick={onDelete}>
                Cancel
            </button>
        </div>
    );
}

export default BookedTicketCard;