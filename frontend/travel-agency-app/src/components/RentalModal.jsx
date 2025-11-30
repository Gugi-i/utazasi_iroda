import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { searchCars } from "../services/carSearchService.js";

export default function RentalModal({ open, onClose, onAddCar, initialCity = "", initialStartDate = "", initialEndDate = ""}) {
  const [city, setCity] = useState(initialCity);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minSpace, setMinSpace] = useState("");
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setCity(initialCity);
      setStartDate(initialStartDate);
      setEndDate(initialEndDate);
      setMinPrice("");
      setMaxPrice("");
      setMinSpace("");
      setCars([]);
      setSelectedCar(null);
      setError("");
    }
  }, [open, initialCity, initialStartDate, initialEndDate]);

  const handleSearch = async () => {
    if (!city || !startDate || !endDate) {
      setError("City, start date, and end date are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const results = await searchCars({
        city,
        min_price: minPrice || null,
        max_price: maxPrice || null,
        min_space: minSpace || null,
        start_date: startDate,
        end_date: endDate
      });

      setCars(results);
    } catch (e) {
      console.error(e);
      setError("Failed to fetch cars.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCar = () => {
    if (!selectedCar) {
      setError("Please select a car.");
      return;
    }
    const numDays = Math.floor((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
    console.log(numDays)
    const rentalWithDates = { ...selectedCar, startDate, endDate, numDays};
    onAddCar(rentalWithDates);
    onClose();
  };

  return (
    <Modal open={open} title="Search Rental Cars" onClose={onClose}>
      {error && <div style={{ color: "red" }}>{error}</div>}

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <label>City:</label>
        <input
          className="home-input"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        
        <label>Start date:</label>
        <input
          type="date"
          className="home-input"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <label>End date:</label>
        <input
          type="date"
          className="home-input"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <label>Min price:</label>
        <input
          className="home-input"
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <label>Max price:</label>
        <input
          className="home-input"
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <label>Min space:</label>
        <input
          className="home-input"
          type="number"
          placeholder="Min Space"
          value={minSpace}
          onChange={(e) => setMinSpace(e.target.value)}
        />

        <button className="action-button" onClick={handleSearch}>
          {loading ? "Searching..." : "Search Cars"}
        </button>
      </div>

      {cars.length > 0 && (
        <div className="flight-results">
          {cars.map((c) => (
            <div
              key={c.id}
              className={`flight-card ${selectedCar?.id === c.id ? "selected" : ""}`}
              onClick={() => setSelectedCar(c)}
            >
              <div><strong>{c.make} {c.model} ({c.year})</strong></div>
              <div>City: {c.city}</div>
              <div>Price per day: ${c.price_per_day}</div>
              <div>Seats: {c.space}</div>
              <div>Status: {c.status}</div>
            </div>
          ))}
        </div>
      )}

      {cars.length > 0 && (
        <button className="action-button" onClick={handleAddCar}>
          Add Car
        </button>
      )}
    </Modal>
  );
}
