// components/FeaturedVehicles.js
import React from 'react';
import './FeaturedVehicles.css'; // CSS for featured vehicles

// A simple CarCard component to render individual cars
const CarCard = ({ car }) => {
    return (
        <div className="car-card">
            <img src={car.imageUrl} alt={car.name} />
            <h3>{car.name}</h3>
            <p className="car-price">${car.pricePerDay}/day</p>
            <button className="book-now-btn">Book Now</button>
        </div>
    );
};

function FeaturedVehicles() {
    // Dummy data for featured cars
    const cars = [
        { id: 1, name: 'Nissan Altima', pricePerDay: 50.00, imageUrl: 'src/assets/car2.jpg' },
        { id: 2, name: 'Toyota RAV4', pricePerDay: 65.00, imageUrl: 'src/assets/car3.jpg' },
        { id: 3, name: 'Fiat 500', pricePerDay: 40.00, imageUrl: 'src/assets/car1.jpg' },
        { id: 4, name: 'Honda Civic', pricePerDay: 55.00, imageUrl: 'src/assets/car4.jpg' },
        { id: 5, name: 'Ford Mustang', pricePerDay: 80.00, imageUrl: 'src/assets/car5.jpg' },
        { id: 6, name: 'Chevrolet Malibu', pricePerDay: 60.00, imageUrl: 'src/assets/car6.jpg' },
        // Add more cars as needed
    ];

    return (
        <section id="browse" className="featured-vehicles-section">
            <div className="container">
                <h2>Featured Vehicles</h2>
                <div className="car-list">
                    {cars.map(car => (
                        <CarCard key={car.id} car={car} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FeaturedVehicles;
