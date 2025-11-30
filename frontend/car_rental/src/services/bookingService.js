export async function bookCar(carId, pickupDate, returnDate) {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser ? storedUser.id : null;
    const response = await fetch("https://localhost:8000/cars/rent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "car_id": carId,
            "rent_start_date": pickupDate,
            "rent_end_date": returnDate,
            "user_id": userId
        })
    });

    if (!response.ok) {
        throw new Error("Booking request failed");
    }

    return response.json();
}
