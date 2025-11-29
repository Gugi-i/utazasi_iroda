export async function checkCarAvailability(carId, pickupDate, returnDate, location) {
    try {

        //const response = await fetch(
        //    `/api/check-availability?carId=${carId}&pickup=${pickupDate}&return=${returnDate}`
        //);

        //if (!response.ok) {
        //    throw new Error("Failed to check availability");
        //}

        //const data = await response.json();
        const data = true;
        return data;

    } catch (error) {
        console.error(error);
        throw error;
    }
}

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
