import React from "react";
import './BookedTicketCard.css';

function BookedTicketCard({ ticket, onDelete }) {

    const getTime = (dt) => {
        if (!dt) return "--:--";
        return new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getDate = (dt) => {
        if (!dt) return "N/A";
        return new Date(dt).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const calculateDuration = (start, end) => {
        if(!start || !end) return "";
        const diff = new Date(end) - new Date(start);
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.round((diff % 3600000) / 60000);
        return `${hours}h ${minutes}m`;
    };

    return (
        <div className="ticket-card">
            <div className="ticket-header">
                <div className="airline-info">
                    <span className="airline-icon">✈</span>
                    <span className="airline-name">{ticket.airline || "Unknown Airline"}</span>
                </div>
                <span className="flight-number">{ticket.flight_number || "N/A"}</span>
            </div>

            <div className="ticket-body">
                <div className="route-point">
                    <span className="time">{getTime(ticket.departure_date)}</span>
                    <span className="city-code">{ticket.departure_city || "DEP"}</span>
                    <span className="date">{getDate(ticket.departure_date)}</span>
                </div>

                <div className="route-connector">
                    <span className="duration">{calculateDuration(ticket.departure_date, ticket.arrival_date)}</span>
                    <div className="line-graphic">
                        <div className="circle"></div>
                        <div className="line"></div>
                        <span className="plane-graphic">✈</span>
                        <div className="circle"></div>
                    </div>
                    <span className="stop-info">Direct</span>
                </div>

                <div className="route-point">
                    <span className="time">{getTime(ticket.arrival_date)}</span>
                    <span className="city-code">{ticket.arrival_city || "ARR"}</span>
                    <span className="date">{getDate(ticket.arrival_date)}</span>
                </div>
            </div>

            <div className="ticket-footer">
                <div className="price-tag">
                    <span className="currency">€</span>
                    <span className="amount">{ticket.price}</span>
                </div>
                <button className="cancel-btn" onClick={onDelete}>
                    Cancel Booking
                </button>
            </div>
        </div>
    );
}

export default BookedTicketCard;
