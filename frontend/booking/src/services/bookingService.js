export async function bookAccommodation(accommodationId, roomTypeId, checkInDate, checkOutDate) {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser ? storedUser.id : null;

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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Booking failed:", errorData);
        throw new Error(errorData.detail || "Booking request failed");
    }

    return response.json();
}
