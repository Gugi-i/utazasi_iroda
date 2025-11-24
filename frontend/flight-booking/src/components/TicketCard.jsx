import React from "react";

function TicketCard({ ticket, onBook }) {
    return (
        <div className="ticket-card">
            <h3>{ticket.name}</h3>
            <p className="ticket-price">${ticket.price}</p>
            <button className="book-now-btn" onClick={() => onBook(ticket)}>Book Now</button>
        </div>
    );
}

export default TicketCard;