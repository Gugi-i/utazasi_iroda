import React from "react";
import './RentedCarCard.css';

function CarCard({ car, onDelete }) {
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
        console.log(`Deleting rental with id: ${car.id}`);
        onDelete();
    }

    return (
        <div className="rental-card">
            {/* Left: Image */}
            <img src={car.imageUrl} alt={car.carModel} className="rental-card-img" />

            {/* Middle: Text Info */}
            <div className="rental-card-info">
                <h3>{car.carModel}</h3>
                <p className="rental-dates">{car.rentalDate} - {car.returnDate}</p>

                {/* Status Badge logic */}
                <span className={`status-badge ${car.status.toLowerCase()}`}>
                    {car.status}
                </span>
            </div>

            {/* Right: Action Button */}
            <button className="cancel-btn" onClick={onDelete}>
                Cancel
            </button>
        </div>
    );
}

export default CarCard;
