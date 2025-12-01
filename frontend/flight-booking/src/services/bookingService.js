export async function bookTicket({ flight_id, quantity }) {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser ? storedUser.id : null;
    const token = storedUser ? storedUser.access_token : null;
    try {
        const res = await fetch("https://localhost:8000/plane/book", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
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

export async function getTicketsForUser() {
    const storedUser = localStorage.getItem("user");
    const userId = storedUser ? JSON.parse(storedUser).id : null;
    const token = storedUser ? JSON.parse(storedUser).access_token : null;
    const url = `https://localhost:8000/plane/bookings/user/${encodeURIComponent(userId)}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    if (!response.ok) {
        throw new Error("Fetching tickets failed: " + response.status);
    }

    return await response.json();
}

export async function deleteTicket(bookingId) {
    const storedUser = localStorage.getItem("user");
    const token = storedUser ? JSON.parse(storedUser).access_token : null;
    const url = `https://localhost:8000/plane/cancel/${encodeURIComponent(bookingId)}`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    if (!response.ok) {
        throw new Error("Deleting ticket failed: " + response.status);
    }

    return true;
}
