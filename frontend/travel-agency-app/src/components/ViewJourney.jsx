import React, { useState, useEffect } from 'react';
import Snackbar from '../components/Snackbar.jsx';
import './ViewJourney.css';
import {deleteJourney, searchAllJourneys, searchJourneysForUser} from "../services/journeyAccessingService.js";
import ConfirmationModal from '../components/ConfirmationModal.jsx';

function ViewJourney() {
    // --- State Management ---
    const [email, setEmail] = useState('');
    const [journeys, setJourneys] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedJourney, setSelectedJourney] = useState(null);
    const [snackbar, setSnackbar] = useState({ show: false, message: '', type: '' });
    const [journeyToDelete, setJourneyToDelete] = useState(null);

    const handleCancelClick = (journeyId) => {
        setJourneyToDelete(journeyId);
    };

    // 2. ACTION: User clicks "Confirm" inside the Modal
    // We perform the actual API call here
    const handleConfirmDelete = async () => {
        if (!journeyToDelete) return;

        try {
            await deleteJourney(journeyToDelete);

            // Update UI: Remove item from list
            setJourneys(prev => prev.filter(j => j.id !== journeyToDelete));

            // Close the Details modal if it was open for this specific item
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
            // Close the Confirmation Modal
            setJourneyToDelete(null);
        }
    };

    // Helper to close modal without deleting
    const handleCloseDeleteModal = () => {
        setJourneyToDelete(null);
    };

    // --- 1. Load All Journeys on Component Mount ---
    useEffect(() => {
        fetchAllJourneys();
    }, []);

    // --- API Handlers ---

    const fetchAllJourneys = async () => {
        setIsLoading(true);
        try {
            const data = await searchAllJourneys();
            setJourneys(data);
        } catch (error) {
            console.error("API Error:", error);
            // Fallback to mock data so you can see the UI changes
            setJourneys(getMockData());
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

        // 1. If input is empty, revert to showing ALL journeys
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
        // Keep the confirmation dialog
        if (!window.confirm("Are you sure? This will delete the journey and all associated bookings.")) {
            return;
        }

        try {
            // 2. Call the Real API
            await deleteJourney(journeyId);

            // 3. Update Local State (Remove the item from the grid)
            setJourneys(prev => prev.filter(j => j.id !== journeyId));

            // 4. Show Success Message
            setSnackbar({
                show: true,
                message: `Journey #${journeyId} cancelled successfully.`,
                type: 'success'
            });

            // 5. Close Modal if it was open for this item
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

    // --- UPDATED MOCK DATA ---
    const getMockData = () => {
        return [
            {
                id: 101,
                email: 'john.doe@example.com', // <--- Added Email
                total_price: 2450.00,
                start_date: '2024-06-15',
                end_date: '2024-06-25',
                number_of_people: 2,
                plane_tickets: [
                    { id: 1, airline: 'Delta', flight_number: 'DL123', origin: 'JFK', destination: 'LHR', price: 800 },
                    { id: 2, airline: 'Delta', flight_number: 'DL124', origin: 'LHR', destination: 'JFK', price: 800 }
                ],
                cars: [{ id: 5, model: 'Toyota Camry', company: 'Hertz', price: 300 }],
                accommodations: [{ id: 9, name: 'Hilton London', address: '22 Park Lane', price: 550 }]
            },
            {
                id: 102,
                email: 'jane.smith@test.com', // <--- Added Email
                total_price: 150.00,
                start_date: '2024-08-01',
                end_date: '2024-08-03',
                number_of_people: 1,
                plane_tickets: [],
                cars: [{ id: 6, model: 'Ford Fiesta', company: 'Enterprise', price: 150 }],
                accommodations: []
            },
            {
                id: 103,
                email: 'mike.wilson@demo.net', // <--- Added Email
                total_price: 890.00,
                start_date: '2024-09-10',
                end_date: '2024-09-15',
                number_of_people: 2,
                plane_tickets: [],
                cars: [],
                accommodations: [{ id: 12, name: 'Marriott Downtown', address: '100 Main St', price: 890 }]
            }
        ];
    };

    return (
        <div className="view-journey-container">
            <h1 className="page-title">All Journeys</h1>

            {/* --- Search Section --- */}
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

            {/* --- Results Grid --- */}
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

                            {/* --- NEW: Email Display in Card --- */}
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

                            {/* Inventory Badges */}
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

            {/* --- Details Modal --- */}
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
                                    {/* Format the main journey dates */}
                                    {selectedJourney.start_date.replace(/-/g, '.')} - {selectedJourney.end_date.replace(/-/g, '.')}
                                </div>
                            </div>
                            <button className="close-icon" onClick={() => setSelectedJourney(null)}>×</button>
                        </div>

                        <div className="modal-scroll-content">

                            {/* --- Flights Section --- */}
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

                            {/* --- Cars Section --- */}
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
                                                {/* Format Car Rental Dates */}
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

                            {/* --- Accommodations Section --- */}
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
                                                {/* Format Accommodation Dates */}
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

                            {/* Footer with Total Price */}
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
