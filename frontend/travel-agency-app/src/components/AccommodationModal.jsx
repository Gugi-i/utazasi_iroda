import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { searchAccommodations } from "../services/accommodationSearchService.js";
import './AccommodationModal.css'; // Import the new CSS

export default function AccommodationModal({
                                             open,
                                             onClose,
                                             onAddAccommodation,
                                             initialCity = "",
                                             initialStartDate = "",
                                             initialEndDate = ""
                                           }) {
  const [city, setCity] = useState(initialCity);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [maxPrice, setMaxPrice] = useState("");

  const [accommodations, setAccommodations] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setCity(initialCity);
      setStartDate(initialStartDate);
      setEndDate(initialEndDate);
      setMaxPrice("");
      setAccommodations([]);
      setSelectedRoom(null);
      setSelectedHotel(null);
      setError("");
    }
  }, [open, initialCity, initialStartDate, initialEndDate]);

  const handleSearch = async () => {
    if (!city || !startDate || !endDate) {
      setError("City, check-in date, and check-out date are required.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const results = await searchAccommodations({
        location: city,
        max_price: maxPrice || null,
        check_in: startDate,
        check_out: endDate
      });

      console.log(results);
      setAccommodations(results);
    } catch (err) {
      console.error(err);
      setError("Failed to load accommodations.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccommodation = () => {
    if (!selectedRoom) {
      setError("Please select a room type.");
      return;
    }
    const accomodationWithDates = { ...selectedRoom, startDate, endDate, selectedHotel };
    onAddAccommodation(accomodationWithDates);
    onClose();
  };

  return (
      <Modal open={open} title="Search Accommodations" onClose={onClose}>

        {/* Scrollable Wrapper */}
        <div className="accommodation-modal-content">

          {error && <div className="error-box">{error}</div>}

          {/* Input Grid */}
          <div className="search-form-grid">
            <div className="input-group">
              <label>City:</label>
              <input
                  className="home-input"
                  value={city}
                  placeholder="City"
                  onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Check-in:</label>
              <input
                  type="date"
                  className="home-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Check-out:</label>
              <input
                  type="date"
                  className="home-input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Max Price ($):</label>
              <input
                  className="home-input"
                  type="number"
                  placeholder="Any"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Search Button */}
          <div style={{ textAlign: "right", marginBottom: "20px" }}>
            <button className="action-button" onClick={handleSearch} disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          {/* Results List */}
          {accommodations.length > 0 && (
              <div className="accommodation-results-list">
                {accommodations.map((hotel) =>
                    hotel.room_types.map((room) => (
                        <div
                            key={room.id}
                            className={`result-card ${
                                selectedRoom?.id === room.id ? "selected" : ""
                            }`}
                            onClick={() => {
                              setSelectedRoom(room);
                              setSelectedHotel(hotel);
                            }}
                        >
                          {/* Hotel Info Header */}
                          <div className="hotel-header">
                            <span>{hotel.name}</span>
                            <span style={{fontSize: "0.8rem", fontWeight: "normal", color: "#888"}}>{hotel.type}</span>
                          </div>
                          <div className="hotel-location">📍 {hotel.location}</div>

                          <hr className="room-divider" />

                          {/* Room Details */}
                          <div className="room-details">
                    <span className="room-capacity">
                        👥 Capacity: {room.room_capacity}
                    </span>
                            <span className="room-price">
                        ${room.price_per_night} <span style={{fontSize: "0.8rem", fontWeight: "normal", color: "#666"}}>/ night</span>
                    </span>
                          </div>
                        </div>
                    ))
                )}
              </div>
          )}

          {/* Add Button */}
          {accommodations.length > 0 && (
              <div style={{ marginTop: "20px", textAlign: "right" }}>
                <button className="action-button" onClick={handleAddAccommodation}>
                  Add Accommodation
                </button>
              </div>
          )}
        </div>
      </Modal>
  );
}
