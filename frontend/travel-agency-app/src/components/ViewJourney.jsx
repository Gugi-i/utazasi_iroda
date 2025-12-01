import React, { useState } from 'react';
import Snackbar from './components/Snackbar.jsx';
import './ViewJourney.css';

function ViewJourney() {
    const [email, setEmail] = useState('');
    const [journeys, setJourneys] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [snackbar, setSnackbar] = useState({ show: false, message: '', type: '' });

    // State for the Details Modal
    const [selectedJourney, setSelectedJourney] = useState(null);

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, show: false });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!email) {
            setSnackbar({ show: true, message: 'Please enter an email address', type: 'error' });
            return;
        }

        setIsLoading(true);
        setHasSearched(true);

        try {
            // TODO: REPLACE THIS WITH REAL API CALL: axios.get(`/api/journeys?email=${email}`)

            setTimeout(() => {
                // Mocking data based on your SQLAlchemy Model
                const mockData = [
                    {
                        id: 101,
                        total_price: 2450.00,
                        start_date: '2024-06-15',
                        end_date: '2024-06-25',
                        number_of_people: 2,
                        // Relationships
                        plane_tickets: [
                            { id: 1, airline: 'Delta', flight_number: 'DL123', origin: 'JFK', destination: 'LHR', price: 800 },
                            { id: 2, airline: 'Delta', flight_number: 'DL124', origin: 'LHR', destination: 'JFK', price: 800 }
                        ],
                        cars: [
                            { id: 5, model: 'Toyota Camry', company: 'Hertz', price: 300 }
                        ],
                        accommodations: [
                            { id: 9, name: 'Hilton London', address: '22 Park Lane', price: 550 }
                        ]
                    },
                    {
                        id: 102,
                        total_price: 150.00,
                        start_date: '2024-08-01',
                        end_date: '2024-08-03',
                        number_of_people: 1,
                        plane_tickets: [],
                        cars: [
                            { id: 6, model: 'Ford Fiesta', company: 'Enterprise', price: 150 }
                        ],
                        accommodations: []
                    }
                ];

                if(email.includes('test')) {
                    setJourneys(mockData);
                } else {
                    setJourneys([]);
                }
                setIsLoading(false);
            }, 600);

        } catch (error) {
            setSnackbar({ show: true, message: 'Error fetching journeys', type: 'error' });
            setIsLoading(false);
        }
    };

    const handleCancelJourney = (journeyId) => {
        if (window.confirm("Are you sure? This will delete the journey and all associated bookings.")) {
            // API Call would go here
            setJourneys(prev => prev.filter(j => j.id !== journeyId));
            setSnackbar({ show: true, message: `Journey #${journeyId} cancelled.`, type: 'success' });
            setSelectedJourney(null); // Close modal if open
        }
    };

    return (
        <div className="view-journey-container">
            <h1 className="page-title">My Journeys</h1>

            {/* Search Bar */}
            <div className="search-section home-card">
                <form onSubmit={handleSearch} className="search-form-row">
                    <div className="input-group">
                        <label>Search by User Email:</label>
                        <input
                            className="home-input"
                            type="email"
                            placeholder="customer@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="book-button search-btn" disabled={isLoading}>
                        {isLoading ? 'Searching...' : 'Find Journeys'}
                    </button>
                </form>
            </div>

            {/* Grid Results */}
            <div className="results-section">
                {isLoading && <div className="loading-spinner">Loading...</div>}

                {!isLoading && hasSearched && journeys.length === 0 && (
                    <div className="no-results">No journeys found for {email}.</div>
                )}

                <div className="journey-grid">
                    {journeys.map((journey) => (
                        <div key={journey.id} className="journey-card-item">
                            <div className="journey-header">
                                <span className="journey-id">Journey #{journey.id}</span>
                                <span className="journey-dates">
                                    {new Date(journey.start_date).toLocaleDateString()} — {new Date(journey.end_date).toLocaleDateString()}
                                </span>
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
                                {journey.plane_tickets.length > 0 && <span className="badge flight">✈️ {journey.plane_tickets.length} Flights</span>}
                                {journey.cars.length > 0 && <span className="badge car">🚗 {journey.cars.length} Car</span>}
                                {journey.accommodations.length > 0 && <span className="badge hotel">🏨 {journey.accommodations.length} Hotel</span>}
                            </div>

                            <div className="card-actions">
                                <button className="details-btn" onClick={() => setSelectedJourney(journey)}>
                                    View Details
                                </button>
                                <button className="cancel-btn" onClick={() => handleCancelJourney(journey.id)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- DETAILS MODAL --- */}
            {selectedJourney && (
                <div className="modal-overlay" onClick={() => setSelectedJourney(null)}>
                    <div className="modal-panel journey-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Journey Details #{selectedJourney.id}</h2>
                            <button className="close-icon" onClick={() => setSelectedJourney(null)}>×</button>
                        </div>

                        <div className="modal-scroll-content">
                            {/* Flights Section */}
                            <div className="detail-section">
                                <h3>✈️ Flights ({selectedJourney.plane_tickets.length})</h3>
                                {selectedJourney.plane_tickets.length === 0 ? <p className="empty-text">No flights booked.</p> : (
                                    <ul className="detail-list">
                                        {selectedJourney.plane_tickets.map((t, i) => (
                                            <li key={i}>
                                                <strong>{t.airline} ({t.flight_number})</strong>: {t.origin} ➝ {t.destination} <span className="item-price">${t.price}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Cars Section */}
                            <div className="detail-section">
                                <h3>🚗 Car Rentals ({selectedJourney.cars.length})</h3>
                                {selectedJourney.cars.length === 0 ? <p className="empty-text">No cars rented.</p> : (
                                    <ul className="detail-list">
                                        {selectedJourney.cars.map((c, i) => (
                                            <li key={i}>
                                                <strong>{c.model}</strong> ({c.company}) <span className="item-price">${c.price}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Accommodation Section */}
                            <div className="detail-section">
                                <h3>🏨 Accommodations ({selectedJourney.accommodations.length})</h3>
                                {selectedJourney.accommodations.length === 0 ? <p className="empty-text">No hotels booked.</p> : (
                                    <ul className="detail-list">
                                        {selectedJourney.accommodations.map((a, i) => (
                                            <li key={i}>
                                                <strong>{a.name}</strong> <br/>
                                                <small>{a.address}</small> <span className="item-price">${a.price}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="total-footer">
                                <span>Total Price:</span>
                                <span className="total-amount">${selectedJourney.total_price}</span>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="close-btn" onClick={() => setSelectedJourney(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {snackbar.show && <Snackbar message={snackbar.message} type={snackbar.type} onClose={handleCloseSnackbar} />}
        </div>
    );
}

export default ViewJourney;
