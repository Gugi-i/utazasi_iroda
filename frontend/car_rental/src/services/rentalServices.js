export async function getRentalsForUser() {
    const storedUser = localStorage.getItem("user");
    const userId = storedUser ? JSON.parse(storedUser).id : null;
    const token = storedUser ? JSON.parse(storedUser).access_token : null;
    const url = `https://localhost:8000/cars/user/rentals/${encodeURIComponent(userId)}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    if (!response.ok) {
        throw new Error("Fetching rentals failed: " + response.status);
    }

    const data = await response.json();
    for (let i = 0; i < data.length; i++) {
        data[i].imageUrl = data[i].image_url;
    }
    return data;
}

export async function deleteRental(rentId) {
    const storedUser = localStorage.getItem("user");
    const token = storedUser ? JSON.parse(storedUser).access_token : null;
    const url = `https://localhost:8000/cars/rent/${encodeURIComponent(rentId)}`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    if (!response.ok) {
        throw new Error("Deleting rental failed: " + response.status);
    }

    return true;
}
