export async function checkTicketAvailability(ticketId, date, startLocation, destination) {
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

export async function bookTicket(ticketId, date, startLocation, destination){
    /*const response = await fetch("/api/book-car", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            carId,
            pickupDate,
            returnDate,
            location
        })
    });

    if (!response.ok) {
        throw new Error("Booking request failed");
    }
    
    return response.json(); // e.g. { success: true }
    */
   return true
}