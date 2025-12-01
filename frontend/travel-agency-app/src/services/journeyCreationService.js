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
    const allFlights = [...flightThere, ...flightBack].map(flight => ({
      flight_id: flight.id,
      user_id: userId,
      quantity: flight.quantity || 1
    }));

    const mappedCars = cars.map(car => ({
      car_id: car.id,
      user_id: userId,
      rent_start_date: car.startDate,
      rent_end_date: car.endDate
    }));

    const mappedAccommodations = accommodations.map(acc => ({
      room_type_id: acc.id,
      accommodation_id: acc.accommodation_id,
      user_id: userId,
      check_in_date: acc.startDate,
      check_in: acc.startDate,
      check_out: acc.endDate,
      rooms_booked: 1
    }));

    const payload = {
      user_id: userId,
      email: email,
      start_date: startDate,
      end_date: endDate,
      number_of_people: 1,
      cars: mappedCars,
      accommodations: mappedAccommodations,
      planes: allFlights
    };

    console.log("Sending Payload:", JSON.stringify(payload, null, 2));

    const storedUser = localStorage.getItem("user");
    const token = storedUser ? JSON.parse(storedUser).access_token : null;

    const journeyRes = await fetch("https://localhost:8000/journeys/complete", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!journeyRes.ok) {
      const errorData = await journeyRes.json();
      console.error("Server Validation Error:", errorData);
      throw new Error(errorData.detail ? JSON.stringify(errorData.detail) : "Booking failed");
    }

    const data = await journeyRes.json();
    return { success: true, journeyId: data.id || "Confirmed" };

  } catch (err) {
    console.error("Journey creation error:", err);
    return { success: false, error: err.message };
  }
};
/*
    const journey = await journeyRes.json();
    console.log(journey)
    const journeyId = journey.id;
    console.log(journeyId)
    for (const f of [...flightThere, ...flightBack]) {
      console.log(f)
      console.log(f.id)
      console.log(f.quantity)
      const response = await bookTicket(f.id, f.quantity)
      await fetch(`https://localhost:8000/journeys/${journeyId}/add_plane`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plane_ticket_booked_id: response.id })
      });
    }

    for (const c of cars) {
      console.log(c)
      const response = await bookCar(c.id, c.startDate, c.endDate)
      console.log(response)
      await fetch(`https://localhost:8000/journeys/${journeyId}/add-car`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ car_rented_id: response.id })
      });
    }
    for (const a of accommodations) {
      console.log(a)
      const response = await bookAccommodation(a.accommodationId, a.id, a.checkInDate, a.checkOutDate)
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
  } catch (err) {
    console.error("Journey creation error:", err);
    return { success: false, error: err };
  }
};

async function bookTicket( flight_id, quantity ) {
    console.log(flight_id, quantity)
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser ? storedUser.id : null;
    const token = storedUser ? storedUser.access_token : null;
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

    const url = "https://localhost:8000/accommodations/book";

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
            'Authorization': `Bearer ${token}`
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
    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log(storedUser)
    const userId = storedUser ? storedUser.id : null;
    const token = storedUser ? storedUser.access_token : null;
    console.log(token)

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
}*/
