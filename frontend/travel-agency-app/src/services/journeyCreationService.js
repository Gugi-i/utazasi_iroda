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
      await fetch(`https://localhost:8000/journeys/${journeyId}/add_plane`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plane_ticket_booked_id: f.id })
      });
    }

    // 3. Add cars
    for (const c of cars) {
      await fetch(`https://localhost:8000/journeys/${journeyId}/add-car`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ car_rented_id: c.id })
      });
    }

    // 4. Add accommodations
    for (const a of accommodations) {
      await fetch(`https://localhost:8000/journeys/${journeyId}/add_accommodation`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ accommodation_booked_id: a.id })
      });
    }

    return { success: true, journeyId };

  } catch (err) {
    console.error("Journey creation error:", err);
    return { success: false, error: err };
  }
};
