// journeyCreationService.js

export const bookJourney = async ({
  userId,
  email,
  startDate,
  endDate,
  flightThere = [],
  flightBack = [],
  cars = [],
  accommodations = []
}) => {
  try {
    // 1. Create the journey
    console.log(startDate)
    console.log(endDate)
    const storedUser = localStorage.getItem("user");
    const token = storedUser ? JSON.parse(storedUser).access_token : null;
    const journeyRes = await fetch("https://localhost:8000/journeys/", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        user_id: userId,
        email: email,
        start_date: startDate,
        end_date: endDate,
        number_of_people: 1
      })
    });

    const journey = await journeyRes.json();
    console.log(journey)
    const journeyId = journey.id;
    console.log(journeyId)
    // 2. Add flights
    for (const f of [...flightThere, ...flightBack]) {
      const response = bookTicket(f.id, f.quantity)
      await fetch(`https://localhost:8000/journeys/${journeyId}/add_plane`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plane_ticket_booked_id: response.id })
      });
    }

    // 3. Add cars
    for (const c of cars) {
      console.log(c)
      const response = bookCar(c.id, c.startDate, c.endDate)
      await fetch(`https://localhost:8000/journeys/${journeyId}/add-car`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ car_rented_id: response.id })
      });
    }
    /*
    // 4. Add accommodations
    for (const a of accommodations) {
      const response = bookAccommodation
      await fetch(`https://localhost:8000/journeys/${journeyId}/add_accommodation`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ accommodation_booked_id: response.id })
      });
    }

    return { success: true, journeyId };
    */
  } catch (err) {
    console.error("Journey creation error:", err);
    return { success: false, error: err };
  }
};

async function bookTicket({ flight_id, quantity }) {
    const storedUser = localStorage.getItem("user");
    const token = storedUser ? JSON.parse(storedUser).access_token : null;
    try {
        const res = await fetch("https://localhost:8000/plane/book", {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                flight_id: flight_id,
                user_id: userId,
                quantity: quantity
            })
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Booking failed.");
        }

        return await res.json();
    } catch (err) {
        throw err;
    }
}

async function bookAccommodation(accommodationId, roomTypeId, checkInDate, checkOutDate) {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser ? storedUser.id : null;
    const token = storedUser ? storedUser.access_token : null;

    const url = "https://localhost:8000/accommodations/book"; // Updated URL

    const bookingData = {
        accommodation_id: accommodationId,
        room_type_id: roomTypeId,
        user_id: userId,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        rooms_booked: 1
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // This is the standard format
        },
        body: JSON.stringify(bookingData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Booking failed:", errorData);
        throw new Error(errorData.detail || "Booking request failed");
    }

    return response.json();
}

async function bookCar(carId, pickupDate, returnDate) {
    const storedUser = localStorage.getItem("user");
    const userId = storedUser ? storedUser.id : null;
    const token = storedUser ? storedUser.access_token : null;

    const response = await fetch("https://localhost:8000/cars/rent", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
            "car_id": carId,
            "rent_start_date": pickupDate,
            "rent_end_date": returnDate,
            "user_id": userId
        })
    });

    if (!response.ok) {
        throw new Error("Booking request failed");
    }

    return response.json();
}
