import React, { useEffect, useRef, useState } from "react";
import './MyRentalsPage.css';
import '../App.css';
import RentedCarCard from "./RentedCarCard.jsx";
import { deleteRental, getRentalsForUser } from "../services/rentalServices.js";
import Snackbar from "../components/Snackbar.jsx";
import ConfirmationModal from "./ConfirmationModal.jsx";

function MyRentalsPage({ onClose }) {
    const modalRef = useRef(null);
    const [rentals, setRentals] = useState([]);

    const [snackbar, setSnackbar] = useState({ show: false, message: '', type: '' });

    const [confirmModal, setConfirmModal] = useState({
        show: false,
        itemToDelete: null
    });

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, show: false });
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                if (!confirmModal.show) {
                    onClose();
                }
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose, confirmModal.show]);

    const getRentals = () => {
        getRentalsForUser().then(data => {
            const mappedRentals = data.map(rental => {
                const carInfo = rental.car || rental;
                return {
                    car_id: rental.car_id,
                    rent_id: rental.id || rental.rental_id,
                    carModel: `${carInfo.make} ${carInfo.model}`,
                    rentalDate: rental.rent_start_date ? rental.rent_start_date.replace(/-/g, '.') : '',
                    returnDate: rental.rent_end_date ? rental.rent_end_date.replace(/-/g, '.') : '',
                    status: rental.status,
                    imageUrl: carInfo.imageUrl || rental.imageUrl
                };
            });
            setRentals(mappedRentals);
        }).catch(error => {
            console.error('Error fetching rentals:', error);
            setSnackbar({ show: true, message: 'Failed to load rentals.', type: 'error' });
        });
    }

    useEffect(() => {
        getRentals();
    }, []);

    const initiateDelete = (car) => {
        setConfirmModal({
            show: true,
            itemToDelete: car
        });
    };

    const closeConfirmModal = () => {
        setConfirmModal({ show: false, itemToDelete: null });
    };

    const executeDelete = () => {
        const carToDelete = confirmModal.itemToDelete;
        if (!carToDelete) return;

        deleteRental(carToDelete.rent_id)
            .then(() => {
                setSnackbar({ show: true, message: 'Rental cancelled successfully!', type: 'success' });
                getRentals();
                closeConfirmModal();
            })
            .catch((error) => {
                console.error('Error deleting rental:', error);
                setSnackbar({ show: true, message: 'Failed to cancel rental. Please try again.', type: 'error' });
                closeConfirmModal();
            });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-panel" style={{ width: "50%" }} ref={modalRef}>
                <button className="close-x" onClick={onClose}>✕</button>
                <h2>My rentals</h2>

                {rentals.length === 0 ? (
                    <p>You have no rentals at the moment.</p>
                ) : null}

                <div className="rentals-list-container" style={{maxHeight: '70vh', overflowY: 'auto'}}>
                    {rentals.map((car, index) => (
                        <RentedCarCard
                            key={car.rent_id || index}
                            car={car}
                            onDelete={() => initiateDelete(car)}
                        />
                    ))}
                </div>
            </div>

            <ConfirmationModal
                isOpen={confirmModal.show}
                title="Cancel Booking?"
                message={`Are you sure you want to cancel your rental for the ${confirmModal.itemToDelete?.carModel}? This action cannot be undone.`}
                onCancel={closeConfirmModal}
                onConfirm={executeDelete}
            />

            {snackbar.show && (
                <Snackbar
                    message={snackbar.message}
                    type={snackbar.type}
                    onClose={handleCloseSnackbar}
                />
            )}
        </div>
    );
}

export default MyRentalsPage;
