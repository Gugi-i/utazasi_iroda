import React, { useState, useEffect } from 'react';
import Snackbar from '../components/Snackbar.jsx';
import './ViewJourney.css';
import {deleteJourney, searchAllJourneys, searchJourneysForUser} from "../services/journeyAccessingService.js";
import ConfirmationModal from '../components/ConfirmationModal.jsx';

function ViewJourney() {
    const [email, setEmail] = useState('');
    const [journeys, setJourneys] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedJourney, setSelectedJourney] = useState(null);
    const [snackbar, setSnackbar] = useState({ show: false, message: '', type: '' });
    const [journeyToDelete, setJourneyToDelete] = useState(null);

    const handleCancelClick = (journeyId) => {
        setJourneyToDelete(journeyId);
    };

    const handleConfirmDelete = async () => {
        if (!journeyToDelete) return;

        try {
            await deleteJourney(journeyToDelete);

            setJourneys(prev => prev.filter(j => j.id !== journeyToDelete));

            if (selectedJourney && selectedJourney.id === journeyToDelete) {
                setSelectedJourney(null);
            }

            setSnackbar({
                show: true,
                message: `Journey #${journeyToDelete} cancelled successfully.`,
                type: 'success'
            });

        } catch (error) {
            console.error("Delete Error:", error);
            setSnackbar({
                show: true,
                message: 'Failed to cancel journey. Please try again.',
                type: 'error'
            });
        } finally {
            setJourneyToDelete(null);
        }
    };

    const handleCloseDeleteModal = () => {
        setJourneyToDelete(null);
    };

    useEffect(() => {
        fetchAllJourneys();
    }, []);


    const fetchAllJourneys = async () => {
        setIsLoading(true);
        try {
            const data = await searchAllJourneys();
            setJourneys(data);
        } catch (error) {
            console.error("API Error:", error);
            setJourneys([]);
            setSnackbar({
                show: true,
                message: 'Error loading API. Showing mock data.',
                type: 'warning'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            fetchAllJourneys();
            return;
        }

        setIsLoading(true);
        try {
            const data = await searchJourneysForUser(email);

            setJourneys(data);

            if (!(data && data.length > 0)) {
                setJourneys([]);
            }

        } catch (error) {
            if (error.message && error.message.includes("404")) {
                setJourneys([]);
            } else {
                console.error("Search Error:", error);
                setJourneys([]);
                setSnackbar({
                    show: true,
                    message: 'Error searching journeys. Check backend connection.',
                    type: 'error'
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearSearch = () => {
        setEmail('');
        fetchAllJourneys();
    };

    const handleCancelJourney = async (journeyId) => {
        if (!window.confirm("Are you sure? This will delete the journey and all associated bookings.")) {
            return;
        }

        try {
            await deleteJourney(journeyId);

            setJourneys(prev => prev.filter(j => j.id !== journeyId));

            setSnackbar({
                show: true,
                message: `Journey #${journeyId} cancelled successfully.`,
                type: 'success'
            });

            if (selectedJourney && selectedJourney.id === journeyId) {
                setSelectedJourney(null);
            }

        } catch (error) {
            console.error("Delete Error:", error);
            setSnackbar({
                show: true,
                message: 'Failed to cancel journey. Please try again.',
                type: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => { setSnackbar({ ...snackbar, show: false }); };


    return (
        <div className="view-journey-container">
            <h1 className="page-title">All Journeys</h1>

            <div className="search-section">
                <form onSubmit={handleSearch} className="search-form-row">
                    <div className="input-group">
                        <label>Filter by User Email:</label>
                        <input
                            className="home-input"
                            type="email"
                            placeholder="Enter email to filter..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="search-btn" disabled={isLoading}>
                        {isLoading ? 'Searching...' : 'Search'}
                    </button>

                    {email && (
                        <button
                            type="button"
                            className="search-btn clear-btn"
                            onClick={handleClearSearch}
                            style={{ backgroundColor: '#6c757d', marginLeft: '10px' }}
                        >
                            Clear
                        </button>
                    )}
                </form>
            </div>

            <div className="results-section">
                {isLoading && <div className="loading-spinner">Loading records...</div>}

                {!isLoading && journeys.length === 0 && (
                    <div className="no-results">
                        {email ? `No journeys found for "${email}".` : "No journeys found."}
                    </div>
                )}

                <div className="journey-grid">
                    {journeys.map((journey) => (
                        <div key={journey.id} className="journey-card-item">
                            <div className="journey-header">
                                <span className="journey-id">Journey #{journey.id}</span>
                                <span className="journey-dates">
                                    {new Date(journey.start_date).toLocaleDateString()} - {new Date(journey.end_date).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="journey-user-row">
                                <span className="user-label">User:</span>
                                <span className="user-email-text">{journey.email || 'Unknown'}</span>
                            </div>

                            <div className="journey-summary">
                                <div className="summary-stat">
                                    <span className="label">Travelers</span>
                                    <span className="value">{journey.number_of_people}</span>
                                </div>
                                <div className="summary-stat">
                                    <span className="label">Total Cost</span>
                                    <span className="value price">${journey.total_price}</span>
                                </div>
                            </div>

                            <div className="inventory-badges">
                                {journey.plane_tickets && journey.plane_tickets.length > 0 && <span className="badge flight">✈️ {journey.plane_tickets.length} Flights</span>}
                                {journey.cars && journey.cars.length > 0 && <span className="badge car">🚗 {journey.cars.length} Car</span>}
                                {journey.accommodations && journey.accommodations.length > 0 && <span className="badge hotel">🏨 {journey.accommodations.length} Hotel</span>}
                            </div>

                            <div className="card-actions">
                                <button className="details-btn" onClick={() => setSelectedJourney(journey)}>
                                    View Details
                                </button>
                                <button className="cancel-btn" onClick={() => handleCancelClick(journey.id)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedJourney && (
                <div className="modal-overlay" onClick={() => setSelectedJourney(null)}>
                    <div className="modal-panel journey-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <h2>Journey Details #{selectedJourney.id}</h2>
                                <div style={{ fontSize: '0.9rem', color: '#555', marginTop: '5px' }}>
                                    User Email: <strong>{selectedJourney.email}</strong>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#777' }}>
                                    {selectedJourney.start_date.replace(/-/g, '.')} - {selectedJourney.end_date.replace(/-/g, '.')}
                                </div>
                            </div>
                            <button className="close-icon" onClick={() => setSelectedJourney(null)}>×</button>
                        </div>

                        <div className="modal-scroll-content">

                            <div className="detail-section">
                                <h3>✈️ Flights ({selectedJourney.plane_tickets ? selectedJourney.plane_tickets.length : 0})</h3>
                                {(!selectedJourney.plane_tickets || selectedJourney.plane_tickets.length === 0) ? (
                                    <p className="empty-text">No flights booked.</p>
                                ) : (
                                    <ul className="detail-list">
                                        {selectedJourney.plane_tickets.map((wrapper, i) => {
                                            const ticket = wrapper.plane_ticket_booked;
                                            return (
                                                <li key={wrapper.id || i}>
                                                    <div className="item-info">
                                                        <span className="item-name">Flight Booking #{ticket.id}</span>
                                                        <span className="item-details">
                                                Flight ID: {ticket.flight_id}
                                            </span>
                                                    </div>
                                                    <span className="item-price">${ticket.total_price}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>

                            <div className="detail-section">
                                <h3>🚗 Car Rentals ({selectedJourney.cars ? selectedJourney.cars.length : 0})</h3>
                                {(!selectedJourney.cars || selectedJourney.cars.length === 0) ? (
                                    <p className="empty-text">No cars rented.</p>
                                ) : (
                                    <ul className="detail-list">
                                        {selectedJourney.cars.map((wrapper, i) => {
                                            const booking = wrapper.car_rented;
                                            const carDetails = booking.car;

                                            return (
                                                <li key={wrapper.id || i}>
                                                    <div className="item-info">
                                            <span className="item-name">
                                                {carDetails.make} {carDetails.model} ({carDetails.year})
                                            </span>
                                                        <span className="item-details">
                                                            {booking.rent_start_date.replace(/-/g, '.')} - {booking.rent_end_date.replace(/-/g, '.')} <br/>
                                                Pickup: {carDetails.city}
                                            </span>
                                                    </div>
                                                    <span className="item-price">${booking.total_price}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>

                            <div className="detail-section">
                                <h3>🏨 Accommodations ({selectedJourney.accommodations ? selectedJourney.accommodations.length : 0})</h3>
                                {(!selectedJourney.accommodations || selectedJourney.accommodations.length === 0) ? (
                                    <p className="empty-text">No hotels booked.</p>
                                ) : (
                                    <ul className="detail-list">
                                        {selectedJourney.accommodations.map((wrapper, i) => {
                                            const booking = wrapper.accommodation_booked;
                                            const hotelDetails = booking.accommodation;

                                            return (
                                                <li key={wrapper.id || i}>
                                                    <div className="item-info">
                                                        <span className="item-name">{hotelDetails.name}</span>
                                                        <span className="item-details">
                                                            {booking.check_in_date.replace(/-/g, '.')} - {booking.check_out_date.replace(/-/g, '.')} <br/>
                                                            {hotelDetails.location} (Room Type: {booking.room_type_id})
                                            </span>
                                                    </div>
                                                    <span className="item-price">${booking.total_price}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>

                            <div className="total-footer">
                                <span>Total Journey Price:</span>
                                <span className="total-amount">${selectedJourney.total_price}</span>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="close-btn" onClick={() => setSelectedJourney(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {journeyToDelete && (
                <ConfirmationModal
                    isOpen={!!journeyToDelete}
                    title="Cancel Journey"
                    message={`Are you sure you want to cancel Journey #${journeyToDelete}? This action cannot be undone.`}
                    onConfirm={handleConfirmDelete}
                    onClose={handleCloseDeleteModal}
                />
            )}

            {snackbar.show && <Snackbar message={snackbar.message} type={snackbar.type} onClose={handleCloseSnackbar} />}
        </div>
    );
}

export default ViewJourney;
