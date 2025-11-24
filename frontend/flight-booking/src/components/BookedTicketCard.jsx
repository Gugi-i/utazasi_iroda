import React from "react";
import './BookedTicketCard.css';

function TicketCard({ ticket, onDelete }) {
    const deleteRental = () => {
        // fetch(`/api/rentals/${car.id}`, {
        //     method: 'DELETE',
        // })
        // .then(response => {
        //     if (response.ok) {
        //         console.log('Rental deleted successfully');
        //     } else {
        //         console.error('Failed to delete rental');
        //     }
        // })
        // .catch((error) => {
        //     console.error('Error deleting rental:', error);
        // });
        console.log(`Deleting rental with id: ${ticket.id}`);
        onDelete();
    }

    return (
        <div className="rental-card">
            <div className="rental-card-info">
                <h3>{ticket.name}</h3>
            </div>
            <button className="cancel-btn" onClick={onDelete}>
                Cancel
            </button>
        </div>
    );
}

export default TicketCard;
