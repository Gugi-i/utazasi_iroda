export async function searchCars(filters) {
    const params = new URLSearchParams();
    if (filters.pickupDate) {
        params.append("start_date", filters.pickupDate);
    }
    if (filters.returnDate) {
        params.append("end_date", filters.returnDate);
    }
    if (filters.location) {
        params.append("city", filters.location);
    }
    if (filters.min_price) {
        params.append("min_price", filters.min_price);
    }
    if (filters.max_price) {
        params.append("max_price", filters.max_price);
    }
    if (filters.min_space) {
        params.append("min_space", filters.min_space);
    }
    const url = `https://localhost:8000/cars/?${params.toString()}`;
    const response = await fetch(url, {
        method: "GET"
    });

    if (!response.ok) {
        throw new Error("Car search failed: " + response.status);
    }

    const data = await response.json();
    for (let i = 0; i < data.length; i++) {
        data[i].imageUrl = data[i].image_url;
    }

    return data;
}
