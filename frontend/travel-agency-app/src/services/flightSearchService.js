export async function searchTickets(filters) {
    const params = new URLSearchParams();

    console.log("Searching flights using:", filters);

    // Add query params only if they exist (backend accepts optional filters)
    if (filters.departure_city) {
        params.append("departure_city", filters.departure_city);
    }
    if (filters.arrival_city) {
        params.append("arrival_city", filters.arrival_city);
    }
    if (filters.departure_date){
        params.append("departure_date", filters.departure_date)
    }

    const url = `http://localhost:8000/plane?${params.toString()}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Plane search failed: " + response.status);
        }

        return await response.json();
    } catch (err) {
        console.error("Flight search error:", err);

        // OPTIONAL: mock fallback flights (you can remove this if not needed)
        return [
            {
                id: 1,
                flight_number: "LH123",
                airline: "Lufthansa",
                departure_city: "Berlin",
                arrival_city: "Paris",
                departure_date: "2025-02-20T09:00:00",
                arrival_date: "2025-02-20T11:00:00",
                price: 180.00,
                seats_available: 25
            },
            {
                id: 2,
                flight_number: "BA789",
                airline: "British Airways",
                departure_city: "London",
                arrival_city: "Rome",
                departure_date: "2025-02-20T13:00:00",
                arrival_date: "2025-02-20T16:00:00",
                price: 240.00,

                seats_available: 15
            },
            {
                id: 3,
                flight_number: "SK556",
                airline: "SAS",
                departure_city: "Copenhagen",
                arrival_city: "Oslo",
                departure_date: "2025-02-20T16:45:00",
                arrival_date: "2025-02-20T18:10:00",
                price: 120.5,
                total_seats: 180,
                seats_available: 52
            },
            {
                id: 4,
                flight_number: "BA148",
                airline: "British Airways",
                departure_city: "London",
                arrival_city: "Barcelona",
                departure_date: "2025-03-05T10:25:00",
                arrival_date: "2025-03-05T13:40:00",
                price: 185.0,
                total_seats: 220,
                seats_available: 74
            },
            {
                id: 5,
                flight_number: "DL903",
                airline: "Delta Airlines",
                departure_city: "Atlanta",
                arrival_city: "Chicago",
                departure_date: "2025-04-12T08:15:00",
                arrival_date: "2025-04-12T09:55:00",
                price: 142.75,
                total_seats: 160,
                seats_available: 33
            },
            {
                id: 6,
                flight_number: "EK231",
                airline: "Emirates",
                departure_city: "Dubai",
                arrival_city: "Washington D.C.",
                departure_date: "2025-05-18T02:50:00",
                arrival_date: "2025-05-18T08:35:00",
                price: 1099.99,
                total_seats: 350,
                seats_available: 128
            }
        ];
    }
}