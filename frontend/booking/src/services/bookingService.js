export async function bookAccommodation(accommodationId, roomTypeId, checkInDate, checkOutDate) {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser ? storedUser.id : null;
    const token = storedUser ? storedUser.access_token : null;

    const url = "https://localhost:8000/accommodations/book"; // Updated URL

    const bookingData = {
        accommodation_id: accommodationId,
        room_type_id: roomTypeId,
        user_id: userId,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        rooms_booked: 1
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // This is the standard format
        },
        body: JSON.stringify(bookingData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Booking failed:", errorData);
        throw new Error(errorData.detail || "Booking request failed");
    }

    return response.json();
}

export async function getAccommodationsForUser() {
    const storedUser = localStorage.getItem("user");
    const userId = storedUser ? JSON.parse(storedUser).id : null;
    const token = storedUser ? JSON.parse(storedUser).access_token : null;
    const url = `https://localhost:8000/accommodations/bookings/user/${encodeURIComponent(userId)}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // This is the standard format
        }
    });

    if (!response.ok) {
        throw new Error("Fetching rentals failed: " + response.status);
    }

    const data = await response.json();
    console.log(data)
    return data;
}

export async function deleteAccommodation(bookingId) {
    const url = `https://localhost:8000/accommodations/accommodation/booking/${encodeURIComponent(bookingId)}`;
    const storedUser = localStorage.getItem("user");
    const token = storedUser ? JSON.parse(storedUser).access_token : null;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // This is the standard format
        }
    });

    if (!response.ok) {
        throw new Error("Deleting booking failed: " + response.status);
    }

    return true;
}
