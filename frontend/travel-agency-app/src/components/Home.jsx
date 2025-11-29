import { useState } from "react";
import "./Home.css";
import FlightModal from "./FlightModal";
//import FlightBackModal from "./FlightBackModal";
//import CarModal from "./CarModal";
//import AccommodationModal from "./AccommodationModal";


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
  const [flightThere, setFlightThere] = useState(null);
  const [flightBack, setFlightBack] = useState(null);
  const [cars, setCars] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [modal, setModal] = useState(null);
  const [temp, setTemp] = useState({});

  const openModal = (type) => {
    setTemp({});
    setModal(type);
  };

  const confirmModal = () => {
    if (modal === "flight-there") setFlightThere(temp);
    if (modal === "flight-back") setFlightBack(temp);
    if (modal === "car") setCars((prev) => [...prev, temp]);
    if (modal === "accommodation") setAccommodations((prev) => [...prev, temp]);
    setModal(null);
  };

  const bookJourney = () => {
    console.log({ startLocation,destinationLocation, startDate, endDate, flightThere, flightBack, cars, accommodations });
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Plan Your Journey</h1>

      <div className="home-card">
        <input
          className="home-input"
          placeholder="From"
          value={startLocation}
          onChange={(e) => setStartLocation(e.target.value)}
        />

        <input
          className="home-input"
          placeholder="Destination"
          value={destinationLocation}
          onChange={(e) => setDestinationLocation(e.target.value)}
        />

        <div className="date-grid">
          <input
            type="date"
            className="home-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="home-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="button-group">
          <button className="action-button" onClick={() => openModal("flight-there")}>
            Add Flight To
          </button>
          <button className="action-button" onClick={() => openModal("flight-back")}>
            Add Return Flight
          </button>
          <button className="action-button" onClick={() => openModal("car")}>Rent Car</button>
          <button className="action-button" onClick={() => openModal("accommodation")}>
            Book Accommodation
          </button>
        </div>

        <div className="item-list">
          {flightThere && (
            <div className="item-card">
              ✈️ Flight To: {flightThere.from} → {flightThere.to} ({flightThere.date})
            </div>
          )}
          {flightBack && (
            <div className="item-card">
              ✈️ Return Flight: {flightBack.from} → {flightBack.to} ({flightBack.date})
            </div>
          )}
          {cars.map((c, i) => (
            <div key={i} className="item-card">
              🚗 Car Rental: {c.company} ({c.from}–{c.to})
            </div>
          ))}
          {accommodations.map((a, i) => (
            <div key={i} className="item-card">
              🏨 {a.name} ({a.from}–{a.to})
            </div>
          ))}
        </div>

        <button className="book-button" onClick={bookJourney}>
          Book Journey
        </button>
      </div>

      {/* Modals */}
        <FlightModal
        open={modal === "flight-there"}
        onClose={() => setModal(null)}
        onAddFlight={(flight) => setFlightThere(flight)}
        title="Add Flight To"
        initialFrom={startLocation}
        initialTo={destinationLocation}
        initialDate={startDate}
        />

        <FlightModal
        open={modal === "flight-back"}
        onClose={() => setModal(null)}
        onAddFlight={(flight) => setFlightBack(flight)}
        title="Add Return Flight"
        initialFrom={destinationLocation}
        initialTo={startLocation}
        initialDate={endDate}
        />

    </div>
  );
}

