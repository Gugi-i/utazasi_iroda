import React from "react";
import './MyRentalsPage.css'; // CSS for My Rentals Page
import '../App.css';
import CarCard from "./CarCard.jsx";
import RentedCarCard from "./RentedCarCard.jsx";

function MyRentalsPage({ onClose }) {
    let rentals = []; // Placeholder for rentals data
    const getRentals = () => {
        // fetch('/api/rentals', {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        // })
        // .then(response => response.json())
        // .then(data => {
        //     console.log(data);
        //     // Here you would typically set the rentals state with the fetched data
        //     rentals = data;
        // })
        // .catch((error) => {
        //     console.error('Error fetching rentals:', error);
        // });
        rentals = [
            {
                id: 1,
                carModel: "Toyota Camry",
                rentalDate: "2024.06.01.",
                returnDate: "2024.06.05.",
                status: "Completed",
                imageUrl: 'src/assets/car4.jpg'
            },
            {
                id: 2,
                carModel: "Honda Accord",
                rentalDate: "2024.06.10.",
                returnDate: "2024.06.15.",
                status: "Ongoing",
                imageUrl: 'src/assets/car6.jpg'
            }
        ];
    }
    getRentals();
    return (
        <div className="modal-overlay">
            <div className="modal-panel">
                <button className="close-x" onClick={onClose}>✕</button>
                <h2>My rentals</h2>
                {rentals === [] ?
                    (
                        <p>You have no rentals at the moment.</p>
                    ) : null
                }
                {rentals.map((car, index) => (
                    <RentedCarCard key={index} car={car}
                                   onDelete={rentals.filter(item => item !== car)}></RentedCarCard>
                ))}

            </div>
        </div>
    )
}

export default MyRentalsPage;
