export async function searchTickets(filters) {
    const params = new URLSearchParams();

    console.log("Searching flights using:", filters);

    if (filters.departure_city) {
        params.append("departure_city", filters.departure_city);
    }
    if (filters.arrival_city) {
        params.append("arrival_city", filters.arrival_city);
    }
    if (filters.max_price) {
        params.append("max_price", filters.max_price);
    }

    const url = `https://localhost:8000/plane?${params.toString()}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Plane search failed: " + response.status);
        }

        return await response.json();
    } catch (err) {
        console.error("Flight search error:", err);
    }
}
