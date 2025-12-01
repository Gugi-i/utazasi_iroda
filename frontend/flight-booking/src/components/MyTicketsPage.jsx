import React, { useEffect, useRef, useState } from "react";
import './MyTicketsPage.css';
import '../App.css';
import BookedTicketCard from "./BookedTicketCard.jsx";
import { deleteTicket, getTicketsForUser } from "../services/bookingService.js";
import Snackbar from "../components/Snackbar.jsx";
import ConfirmationModal from "./ConfirmationModal.jsx";

function MyTicketsPage({ onClose }) {
    const modalRef = useRef(null);
    const [tickets, setTickets] = useState([]);

    const [snackbar, setSnackbar] = useState({ show: false, message: '', type: '' });

    const [confirmModal, setConfirmModal] = useState({
        show: false,
        itemToDelete: null
    });

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, show: false });
    };


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                if (!confirmModal.show) {
                    onClose();
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose, confirmModal.show]);

    const getTickets = () => {
        getTicketsForUser().then(data => {
           const mappedTickets = data.map(ticket => ({
                id: ticket.id,
                flight_id: ticket.flight_id,
                seat_number: ticket.seat_number,
                price: ticket.total_price,
               airline: ticket.airline,
               flight_number: ticket.flight_number,
                departure_city: ticket.departure_city,
                arrival_city: ticket.arrival_city,
                departure_date: ticket.departure_date,
                arrival_date: ticket.arrival_date
            }));

            setTickets(mappedTickets);
        }).catch(error => {
            console.error('Error fetching tickets:', error);
            setSnackbar({ show: true, message: 'Failed to load tickets.', type: 'error' });
        });
    }

    useEffect(() => {
        getTickets();
    }, []);

    const initiateDelete = (ticket) => {
        setConfirmModal({
            show: true,
            itemToDelete: ticket
        });
    };

    const closeConfirmModal = () => {
        setConfirmModal({ show: false, itemToDelete: null });
    };

    const executeDelete = () => {
        const ticketToDelete = confirmModal.itemToDelete;
        if (!ticketToDelete) return;
        console.log(ticketToDelete)
        deleteTicket(ticketToDelete.id)
            .then(() => {
                setSnackbar({ show: true, message: 'Booking cancelled successfully!', type: 'success' });
                getTickets();
                closeConfirmModal();
            })
            .catch((error) => {
                console.error('Error deleting booking:', error);
                setSnackbar({ show: true, message: 'Failed to cancel ticket. Please try again.', type: 'error' });
                closeConfirmModal();
            });
    };

    return (
        <div className="modal-overlay" style={{ background: "rgba(0,0,0,0.3)" }}>
            <div className="modal-panel" ref={modalRef} style={{ width: "60%" }}>
                <button className="close-x" onClick={onClose}>✕</button>
                <h2>My Tickets</h2>

                {tickets.length === 0 ? (
                    <p>You have no tickets at the moment.</p>
                ) : null}

                <div className="tickets-list-container" style={{maxHeight: '70vh', overflowY: 'auto'}}>
                    {tickets.map((ticket, index) => (
                        <BookedTicketCard
                            key={ticket.rent_id || index}
                            ticket={ticket}
                            onDelete={() => initiateDelete(ticket)}
                        />
                    ))}
                </div>
            </div>
            <ConfirmationModal
                isOpen={confirmModal.show}
                title="Cancel Booking?"
                message={`Are you sure you want to cancel your ticket for the ${confirmModal.itemToDelete?.carModel}? This action cannot be undone.`}
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

export default MyTicketsPage;
