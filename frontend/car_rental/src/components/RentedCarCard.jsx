import React from "react";
import './RentedCarCard.css';

function RentedCarCard({ car, onDelete }) {

    const getStatus = (start, end) => {
        const now = new Date();
        const startDate = new Date(start.replace(/\.$/, '').replace(/\./g, '-'));
        const endDate = new Date(end.replace(/\.$/, '').replace(/\./g, '-'));

        now.setHours(0, 0, 0, 0);

        if (now > endDate) {
            return 'Completed';
        } else if (now >= startDate && now <= endDate) {
            return 'Ongoing';
        } else {
            return 'Upcoming';
        }
    };

    const status = getStatus(car.rentalDate, car.returnDate);

    return (
        <div className="rental-card">
            <img src={car.imageUrl} alt={car.carModel} className="rental-card-img" />

            <div className="rental-card-info">
                <h3>{car.carModel}</h3>
                <p className="rental-dates">{car.rentalDate} - {car.returnDate}</p>

                <span className={`status-badge ${status.toLowerCase()}`}>
                    {status}
                </span>
            </div>
            {status === 'Upcoming' &&
            <button
                className="cancel-btn"
                onClick={onDelete}
            >
                Cancel
            </button>
            }
        </div>
    );
}

export default RentedCarCard;
