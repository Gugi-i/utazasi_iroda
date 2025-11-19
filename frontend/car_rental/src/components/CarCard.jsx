import React from "react";

function CarCard({ car, onBook }) {
    return (
        <div className="car-card">
            <img src={car.imageUrl} alt={car.name} />
            <h3>{car.name}</h3>
            <p className="car-price">${car.pricePerDay}/day</p>
            <button className="book-now-btn" onClick={() => onBook(car)}>Book Now</button>
        </div>
    );
}

export default CarCard;
