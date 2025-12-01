import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { searchCars } from "../services/carSearchService.js";
import './RentalModal.css';

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
      console.log(results)

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
    const rentalWithDates = { ...selectedCar, startDate, endDate, numDays};
    onAddCar(rentalWithDates);
    onClose();
  };

  return (
      <Modal open={open} title="Search Rental Cars" onClose={onClose}>

        <div className="rental-modal-content">

          {error && <div style={{ color: "#dc2626", marginBottom: "10px", padding: "8px", backgroundColor: "#fef2f2", borderRadius: "6px" }}>{error}</div>}

          <div className="search-form-grid">
            <div className="input-group">
              <label>City:</label>
              <input className="home-input" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>

            <div className="input-group">
              <label>Start date:</label>
              <input type="date" className="home-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>

            <div className="input-group">
              <label>End date:</label>
              <input type="date" className="home-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>

            <div className="input-group">
              <label>Min price:</label>
              <input className="home-input" type="number" placeholder="0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
            </div>

            <div className="input-group">
              <label>Max price:</label>
              <input className="home-input" type="number" placeholder="Any" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Min Space:</label>
              <input className="home-input" type="number" placeholder="1" value={minSpace} onChange={(e) => setMinSpace(e.target.value)} />
            </div>
          </div>

          <div style={{ textAlign: "right", marginBottom: "20px" }}>
            <button className="action-button" onClick={handleSearch} disabled={loading}>
              {loading ? "Searching..." : "Search Cars"}
            </button>
          </div>

          {cars.length > 0 && (
              <div className="car-results-list">
                {cars.map((c) => (
                    <div
                        key={c.id}
                        className={`result-card ${selectedCar?.id === c.id ? "selected" : ""}`}
                        onClick={() => setSelectedCar(c)}
                    >
                      <div className="card-header">{c.make} {c.model} ({c.year})</div>
                      <div className="card-details">
                        <span>📍 {c.city}</span>
                        <span>💺 {c.space} Seats</span>
                        <span className="price-tag">${c.price_per_day}/day</span>
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#666", marginTop: "4px" }}>Status: {c.status}</div>
                    </div>
                ))}
              </div>
          )}

          {cars.length > 0 && (
              <div style={{ marginTop: "20px", textAlign: "right" }}>
                <button className="action-button" onClick={handleAddCar}>
                  Add Selected Car
                </button>
              </div>
          )}
        </div>
      </Modal>
  );
}
