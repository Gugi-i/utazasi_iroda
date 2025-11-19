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
        <div className="car-card">
            <img src={car.imageUrl} alt={car.carModel} />
            <h3>{car.carModel}</h3>
            <p className="rental-dates">{car.rentalDate} - {car.returnDate}</p>
            <button className="delete-btn" onClick={deleteRental}>Cancel</button>
        </div>
    );
}

export default CarCard;
