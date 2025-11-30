export async function bookTicket({ flight_id, quantity }) {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser ? storedUser.id : null;
    try {
        const res = await fetch("http://localhost:8000/plane/book", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
    const url = `http://localhost:8000/plane/bookings/user/${encodeURIComponent(userId)}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Fetching tickets failed: " + response.status);
    }

    const data = await response.json();
    return data;
}

export async function deleteTicket(bookingId) {
    const url = `http://localhost:8000/plane/cancel/${encodeURIComponent(bookingId)}`;
    const response = await fetch(url, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error("Deleting ticket failed: " + response.status);
    }

    return true;
}
