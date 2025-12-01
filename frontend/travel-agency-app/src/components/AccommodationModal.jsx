import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { searchAccommodations } from "../services/accommodationSearchService.js";

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
      setError("");
    }
  }, [open, initialCity, initialStartDate, initialEndDate]);

  const handleSearch = async () => {
    if (!city || !startDate || !endDate) {
      setError("City, start date and end date are required.");
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
      console.log(selectedRoom)
      const accomodationWithDates = { ...selectedRoom, startDate, endDate, selectedHotel}
      onAddAccommodation(accomodationWithDates);

    onClose();
  };

  return (
    <Modal open={open} title="Search Accommodations" onClose={onClose}>
      {error && <div style={{ color: "red" }}>{error}</div>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        <label>City:</label>
        <input
          className="home-input"
          value={city}
          placeholder="City"
          onChange={(e) => setCity(e.target.value)}
        />

        <label>Check-in:</label>
        <input
          type="date"
          className="home-input"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <label>Check-out:</label>
        <input
          type="date"
          className="home-input"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <label>Max Price:</label>
        <input
          className="home-input"
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <button className="action-button" onClick={handleSearch}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {accommodations.length > 0 && (
        <div className="flight-results">
          {accommodations.map((hotel) =>
            hotel.room_types.map((room) => (
              <div
                key={room.id}
                className={`flight-card ${
                  selectedRoom?.id === room.id ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedRoom(room)
                  setSelectedHotel(hotel)
                }}
              >

                <div>
                  <strong>{hotel.name}</strong>
                </div>
                <div>Location: {hotel.location}</div>

                <hr />

                <div><strong>Room Capacity:</strong> {room.room_capacity}</div>
                <div><strong>Price:</strong> ${room.price_per_night} / night</div>
              </div>
            ))
          )}
        </div>
      )}

      {accommodations.length > 0 && (
        <button className="action-button" onClick={handleAddAccommodation}>
          Add Accommodation
        </button>
      )}
    </Modal>
  );
}
