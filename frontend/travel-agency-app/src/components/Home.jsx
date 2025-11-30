import { useState } from "react";
import "./Home.css";
import FlightModal from "./FlightModal";
import RentalModal from "./RentalModal";
//import AccommodationModal from "./AccommodationModal";
import { bookJourney } from "../services/journeyCreationService.js";


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

export default function Home() {
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

  const openModal = (type) => {
    setTemp({});
    setModal(type);
  };

  const handleBookJourney = async () => {
    console.log("startDate:", startDate);
    console.log("endDate:", endDate);
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
      alert("Journey booked successfully! ID: " + result.journeyId);
    } else {
      alert("Booking failed: " + result.error);
    }
};

  return (
    <div className="home-container">
      <h1 className="home-title">Plan a Journey</h1>

      <div className="home-card">
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
              className="home-input"
              placeholder="e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="date-grid">
          <div className="date-field">
            <label>Start date:</label>
            <input
              type="date"
              className="home-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="date-field">
            <label>End date:</label>
            <input
              type="date"
              className="home-input"
              value={endDate}
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
                ({new Date(f.departure_date).toLocaleString()}) — Tickets: {f.quantity} , Price: {f.price*f.quantity}$
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
          <label>Accomodations: </label>
          {accommodations.map((a, i) => (
            <div key={i} className="item-card">
              Accomodation: {a.name} ({a.from}–{a.to})
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
        onAddFlight={(flight) => 
          setFlightThere(prev => [...prev, flight])
        }
        title="Add Flight To"
        initialFrom={startLocation}
        initialTo={destinationLocation}
        initialDate={startDate}
        />

        <FlightModal
        open={modal === "flight-back"}
        onClose={() => setModal(null)}
        onAddFlight={(flight) => 
          setFlightBack(prev => [...prev, flight])
        }
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


    </div>
  );
}

