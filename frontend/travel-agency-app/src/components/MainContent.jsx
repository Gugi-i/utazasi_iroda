import { useState, useRef } from "react"; // Import useRef
import "./MainContent.css";
import FlightModal from "./FlightModal";
import RentalModal from "./RentalModal";
import AccommodationModal from "./AccommodationModal";
import { bookJourney } from "../services/journeyCreationService.js";
import Header from "./Header.jsx";
import Snackbar from "../components/Snackbar.jsx";

function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
      <div className="modal-overlay">
        <div className="modal-box">
          <h2 className="modal-title">{title}</h2>
          {children}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
            <button className="modal-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
  );
}

export default function MainContent() {
  const [startLocation, setStartLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [flightThere, setFlightThere] = useState([]);
  const [flightBack, setFlightBack] = useState([]);
  const [cars, setCars] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [modal, setModal] = useState(null);
  const [email, setEmail] = useState("");
  const [temp, setTemp] = useState({});

  // Create a ref for the email input to use browser validation
  const emailInputRef = useRef(null);

  const [snackbar, setSnackbar] = useState({ show: false, message: '', type: '' });

  const today = new Date().toISOString().split("T")[0];

  const openModal = (type) => {
    setTemp({});
    setModal(type);
  };

  const handleStartDateChange = (e) => {
    const newStart = e.target.value;
    setStartDate(newStart);

    if (endDate && newStart > endDate) {
      setEndDate("");
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, show: false });
  };

  // Basic email regex for manual validation
  const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
  };

  const handleBookJourney = async () => {
    console.log("startDate:", startDate);
    console.log("endDate:", endDate);

    // 1. Validate Email
    if (!email) {
      setSnackbar({ show: true, message: "Please provide an email address.", type: 'error' });
      // Focus the input to show the user where the error is
      if (emailInputRef.current) emailInputRef.current.focus();
      return;
    }

    if (!validateEmail(email)) {
      setSnackbar({ show: true, message: "Please enter a valid email address.", type: 'error' });
      if (emailInputRef.current) {
        emailInputRef.current.focus();
        // Optional: trigger browser's native validation message
        // emailInputRef.current.reportValidity();
      }
      return;
    }

    const result = await bookJourney({
      userId: 1,
      email: email,
      startDate,
      endDate,
      flightThere,
      flightBack,
      cars,
      accommodations
    });

    if (result.success) {
      setSnackbar({
        show: true,
        message: `Journey booked successfully! ID: ${result.journeyId}`,
        type: 'success'
      });
    } else {
      setSnackbar({
        show: true,
        message: `Booking failed: ${result.error}`,
        type: 'error'
      });
    }
  };

  return (
      <div className="home-container">
        <h1 className="home-title">Plan a Journey</h1>

        <div className="home-card">
          {/* ... Inputs ... */}
          <div className="date-grid">
            <div className="date-field">
              <label>Start location:</label>
              <input
                  className="home-input"
                  placeholder="From"
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
              />
            </div>

            <div className="date-field">
              <label>Destination location:</label>
              <input
                  className="home-input"
                  placeholder="Destination"
                  value={destinationLocation}
                  onChange={(e) => setDestinationLocation(e.target.value)}
              />
            </div>

            <div className="date-field">
              <label>Email:</label>
              <input
                  ref={emailInputRef} // Attach ref here
                  className="home-input"
                  placeholder="e-mail"
                  value={email}
                  type="email" // Ensure type is email
                  required     // Mark as required
                  // Basic HTML5 validation pattern (optional but helpful)
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  onChange={(e) => setEmail(e.target.value)}
                  // Optional: Clear custom validity message on change
                  onInput={(e) => e.target.setCustomValidity('')}
              />
            </div>
          </div>

          {/* ... Rest of your component (Dates, Buttons, Lists, Modals) remains unchanged ... */}
          <div className="date-grid">
            <div className="date-field">
              <label>Departure Date</label>
              <input
                  type="date"
                  className="home-input modern-date"
                  value={startDate}
                  min={today}
                  onChange={handleStartDateChange}
              />
            </div>

            <div className="date-field">
              <label>Return Date</label>
              <input
                  type="date"
                  className="home-input modern-date"
                  value={endDate}
                  min={startDate || today}
                  disabled={!startDate}
                  onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="button-group">
            <button className="action-button" onClick={() => openModal("flight-there")}>
              Add Flight To
            </button>
            <button className="action-button" onClick={() => openModal("flight-back")}>
              Add Return Flight
            </button>
            <button className="action-button" onClick={() => openModal("car")}>
              Rent Car
            </button>
            <button className="action-button" onClick={() => openModal("accommodation")}>
              Book Accommodation
            </button>
          </div>

          <div className="item-list">
            <label>Flights to destination: </label>
            {flightThere.map((f, i) => (
                <div key={i} className="item-card">
                  <div>
                    Flight {f.flight_number} — {f.airline}: {f.departure_city} → {f.arrival_city}
                    ({new Date(f.departure_date).toLocaleString()}) — Tickets: {f.quantity} ,
                    Price: {f.price * f.quantity}$
                  </div>
                  <button
                      className="remove-button"
                      onClick={() => setFlightThere(prev => prev.filter((_, idx) => idx !== i))}
                  >
                    Remove
                  </button>
                </div>
            ))}
            <label>Return Flights: </label>
            {flightBack.map((f, i) => (
                <div key={i} className="item-card">
                  <div>
                    Flight {f.flight_number} — {f.airline}: {f.departure_city} → {f.arrival_city}
                    ({new Date(f.departure_date).toLocaleString()}) — Tickets: {f.quantity} , Price: {f.price*f.quantity}$
                  </div>
                  <button
                      className="remove-button"
                      onClick={() => setFlightBack(prev => prev.filter((_, idx) => idx !== i))}
                  >
                    Remove
                  </button>
                </div>
            ))}
            <label>Chosen vehicles: </label>
            {cars.map((c, i) => (
                <div key={i} className="item-card">
                  <div>
                    Car: {c.make} {c.model} {c.startDate} — {c.endDate}, Price: {c.price_per_day*c.numDays}$
                  </div>
                  <button
                      className="remove-button"
                      onClick={() => setCars(prev => prev.filter((_, idx) => idx !== i))}
                  >
                    Remove
                  </button>
                </div>
            ))}
            <label>Accommodations: </label>
            {accommodations.map((a, i) => (
                <div key={i} className="item-card">
                  <div>
                    Hotel: {a.selectedHotel.name} — Room Capacity: {a.room_capacity} person(s)
                    ({a.startDate} – {a.endDate}) — Total Price:
                    {a.price_per_night * Math.floor((new Date(a.endDate) - new Date(a.startDate)) / (1000*60*60*24) + 1)}$
                  </div>
                  <button
                      className="remove-button"
                      onClick={() => setAccommodations(prev => prev.filter((_, idx) => idx !== i))}
                  >
                    Remove
                  </button>
                </div>
            ))}
          </div>

          <button className="book-button" onClick={handleBookJourney}>
            Book Journey
          </button>
        </div>

        {/* Modals */}
        <FlightModal
            open={modal === "flight-there"}
            onClose={() => setModal(null)}
            onAddFlight={(flight) => setFlightThere(prev => [...prev, flight])}
            title="Add Flight To"
            initialFrom={startLocation}
            initialTo={destinationLocation}
            initialDate={startDate}
        />

        <FlightModal
            open={modal === "flight-back"}
            onClose={() => setModal(null)}
            onAddFlight={(flight) => setFlightBack(prev => [...prev, flight])}
            title="Add Return Flight"
            initialFrom={destinationLocation}
            initialTo={startLocation}
            initialDate={endDate}
        />

        <RentalModal
            open={modal === "car"}
            onClose={() => setModal(null)}
            onAddCar={(car) => setCars((prev) => [...prev, car])}
            initialCity={destinationLocation}
            initialStartDate={startDate}
            initialEndDate={endDate}
        />

        <AccommodationModal
            open={modal === "accommodation"}
            onClose={() => setModal(null)}
            onAddAccommodation={(accommodations) => setAccommodations((prev) => [...prev, accommodations])}
            initialCity={destinationLocation}
            initialStartDate={startDate}
            initialEndDate={endDate}
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
