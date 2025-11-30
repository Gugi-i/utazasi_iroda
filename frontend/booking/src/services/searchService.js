export async function searchAccommodations(filters) {
    const params = new URLSearchParams();
    if (filters.check_in) {
        params.append("check_in", filters.check_in);
    }
    if (filters.check_out) {
        params.append("check_out", filters.check_out);
    }
    if (filters.location) {
        params.append("location", filters.location);
    }
    if (filters.max_price) {
        params.append("max_price", filters.max_price);
    }
    const url = `https://localhost:8000/accommodations/?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Car search failed: " + response.status);
    }

    return await response.json();
}
