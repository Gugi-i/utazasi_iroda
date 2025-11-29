import React from "react";
import './RentedCarCard.css';

function RentedCarCard({ car, onDelete }) {
    return (
        <div className="rental-card">
            <img src={car.imageUrl} alt={car.carModel} className="rental-card-img" />

            <div className="rental-card-info">
                <h3>{car.carModel}</h3>
                <p className="rental-dates">{car.rentalDate} - {car.returnDate}</p>

                {/* Status Badge logic */}
                {/*<span className={`status-badge ${car.status.toLowerCase()}`}>*/}
                {/*    {car.status}*/}
                {/*</span>*/}
            </div>

            <button className="cancel-btn" onClick={onDelete}>
                Cancel
            </button>
        </div>
    );
}

export default RentedCarCard;
