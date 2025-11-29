import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { searchTickets } from "../services/flightSearchService.js";

export default function FlightModal({ open, onClose, onAddFlight, initialFrom = "", initialTo = "", initialDate = "" }) {
  const [departureCity, setDepartureCity] = useState(initialFrom);
  const [arrivalCity, setArrivalCity] = useState(initialTo);
  const [departureDate, setDepartureDate] = useState(initialDate);
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setDepartureCity(initialFrom);
      setArrivalCity(initialTo);
      setDepartureDate(initialDate);
      setFlights([]);
      setSelectedFlight(null);
      setError("");
    }
  }, [open, initialFrom, initialTo, initialDate]);

  const handleSearch = async () => {
    if (!departureCity || !arrivalCity || !departureDate) {
      setError("Departure city, arrival city, and departure date are required.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const results = await searchTickets({
        departure_city: departureCity,
        arrival_city: arrivalCity,
        departure_date: departureDate
      });

      setFlights(results);
      setSelectedFlight(null); // reset selection
    } catch (err) {
      console.error(err);
      setError("Failed to fetch flights.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFlight = () => {
    if (!selectedFlight) {
      setError("Please select a flight to add.");
      return;
    }
    onAddFlight(selectedFlight);
    onClose();
  };

  return (
    <Modal open={open} title="Search Flights" onClose={onClose}>
      {error && <div style={{ color: "red" }}>{error}</div>}

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <input
          className="home-input"
          placeholder="From"
          value={departureCity}
          onChange={(e) => setDepartureCity(e.target.value)}
        />
        <input
          className="home-input"
          placeholder="To"
          value={arrivalCity}
          onChange={(e) => setArrivalCity(e.target.value)}
        />
        <input
          type="date"
          className="home-input"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
        />
        <button className="action-button" onClick={handleSearch}>
          {loading ? "Searching..." : "Search Flights"}
        </button>
      </div>

      {flights.length > 0 && (
        <div className="flight-results">
          {flights.map((f) => (
            <div
              key={f.id}
              className={`flight-card ${selectedFlight?.id === f.id ? "selected" : ""}`}
              onClick={() => setSelectedFlight(f)}
            >
              <div>
                 {f.departure_city} → {f.arrival_city}
              </div>
              <div>Date: {new Date(f.departure_date).toLocaleString()}</div>
              <div>Airline: {f.airline}</div>
              <div>Price: ${f.price}</div>
              <div>Seats Available: {f.seats_available}</div>
            </div>
          ))}
        </div>
      )}

      {flights.length > 0 && (
        <button className="action-button" onClick={handleAddFlight}>
          Add Flight
        </button>
      )}
    </Modal>
  );
}
