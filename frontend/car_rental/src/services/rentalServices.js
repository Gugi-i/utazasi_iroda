export async function getRentalsForUser() {
    const storedUser = localStorage.getItem("user");
    const userId = storedUser ? JSON.parse(storedUser).id : null;
    const url = `https://localhost:8000/cars/user/rentals/${encodeURIComponent(userId)}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Fetching rentals failed: " + response.status);
    }

    const data = await response.json();
    for (let i = 0; i < data.length; i++) {
        data[i].imageUrl = 'src/assets/car' + ((data[i].car_id % 6) + 1) + '.jpg';
    }
    return data;
}

export async function deleteRental(rentId) {
    const url = `https://localhost:8000/cars/rent/${encodeURIComponent(rentId)}`;
    const response = await fetch(url, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error("Deleting rental failed: " + response.status);
    }

    return true;
}
