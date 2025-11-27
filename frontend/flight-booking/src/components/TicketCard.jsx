import React from "react";

function TicketCard({ ticket, onBook }) {
    const depart = new Date(ticket.departure_date);
    const arrive = new Date(ticket.arrival_date);

    const formatTime = (d) =>
        d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    return (
        <div className="ticket-card">
            <div className="ticket-header">
                <h3>{ticket.airline}</h3>
                <span className="flight-number">{ticket.flight_number}</span>
            </div>

            <div className="ticket-route">
                <div>
                    <strong>{ticket.departure_city}</strong>
                    <br />
                    {formatTime(depart)}
                </div>
                <div className="arrow">→</div>
                <div>
                    <strong>{ticket.arrival_city}</strong>
                    <br />
                    {formatTime(arrive)}
                </div>
            </div>

            <p className="ticket-price">€{ticket.price}</p>

            <p className="seats-left">
                Seats left: {ticket.seats_available} / {ticket.total_seats}
            </p>

            <button className="book-now-btn" onClick={onBook}>
                Book Now
            </button>
        </div>
    );
}

export default TicketCard;
