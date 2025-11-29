export async function searchCars(filters) {
    const params = new URLSearchParams();

    const url = `https://localhost:8000/cars/?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Car search failed: " + response.status);
    }

    const data = await response.json();
    for (let i = 0; i < data.length; i++) {
        data[i].imageUrl = 'src/assets/car' + ((data[i].id % 6) + 1) + '.jpg';
    }

    return data;
}
