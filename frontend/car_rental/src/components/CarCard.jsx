import React from "react";

function CarCard({ car, onBook }) {
    return (
        <div className="car-card">
            <img src={car.imageUrl} alt={car.make} />
            <h3>{car.make} {car.model}</h3>
            <h4>{car.space} people</h4>
            <p className="car-price">€{car.price_per_day}/day</p>
            <button className="book-now-btn" onClick={() => onBook(car)}>Book Now</button>
        </div>
    );
}

export default CarCard;
