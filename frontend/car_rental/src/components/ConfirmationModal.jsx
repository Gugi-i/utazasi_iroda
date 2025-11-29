import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="confirm-overlay" onClick={onCancel}>
            <div className="confirm-modal" onClick={handleContentClick}>
                <h3>{title || "Cancel Booking?"}</h3>
                <p>{message || "Are you sure you want to cancel this rental? This action cannot be undone."}</p>
                <div className="confirm-actions">
                    <button className="confirm-btn btn-cancel" onClick={onCancel}>
                        Keep Rental
                    </button>
                    <button className="confirm-btn btn-delete" onClick={onConfirm}>
                        Yes, Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
