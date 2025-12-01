export async function searchCars(filters) {
  const params = new URLSearchParams();
  console.log("Searching cars using:", filters);

  if (filters.city) params.append("city", filters.city);
  if (filters.min_price) params.append("min_price", filters.min_price);
  if (filters.max_price) params.append("max_price", filters.max_price);
  if (filters.min_space) params.append("min_space", filters.min_space);
  if (filters.start_date) params.append("start_date", filters.start_date);
  if (filters.end_date) params.append("end_date", filters.end_date);

  const url = `https://localhost:8000/cars?${params.toString()}`;
  console.log("Car search URL:", url);

  const res = await fetch(url);
  if (!res.ok) throw new Error("Car search failed: " + res.status);
  return res.json();
}
