import React, {useEffect, useRef, useState} from "react";
import './MyRentalsPage.css'; // CSS for My Rentals Page
import '../App.css';
import RentedCarCard from "./RentedCarCard.jsx";

function MyRentalsPage({ onClose }) {
    const modalRef = useRef(null);

    // Close modal when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);
    const [rentals, setRentals] = useState([]);
    useEffect(() => {
        getRentals();
    }, []);const getRentals = () => {
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
        const mockData = [
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
                imageUrl: 'src/assets/car5.jpg'
            },
            {
                id: 3,
                carModel: "Ford Mustang",
                rentalDate: "2024.06.20.",
                returnDate: "2024.06.25.",
                status: "Upcoming",
                imageUrl: 'src/assets/car6.jpg'
            },
            {
                id: 4,
                carModel: "Chevrolet Malibu",
                rentalDate: "2024.07.01.",
                returnDate: "2024.07.05.",
                status: "Upcoming",
                imageUrl: 'src/assets/car2.jpg'
            },
            {
                id: 5,
                carModel: "Nissan Altima",
                rentalDate: "2024.07.10.",
                returnDate: "2024.07.15.",
                status: "Upcoming",
                imageUrl: 'src/assets/car3.jpg'
            }
        ];
        setRentals(mockData);
    }
    const handleDelete = (carToDelete) => {
        setRentals(rentals.filter(item => item.id !== carToDelete.id));
    };
    // getRentals();
    return (
        <div className="modal-overlay" ref={modalRef}>
            <div className="modal-panel" style={{width: "50%"}}>
                <button className="close-x" onClick={onClose}>✕</button>
                <h2>My rentals</h2>
                {rentals === [] ?
                    (
                        <p>You have no rentals at the moment.</p>
                    ) : null
                }
                {rentals.map((car, index) => (
                    <RentedCarCard key={index} car={car}
                                   onDelete={() => handleDelete(car)}></RentedCarCard>
                ))}

            </div>
        </div>
    );
}

export default MyRentalsPage;
