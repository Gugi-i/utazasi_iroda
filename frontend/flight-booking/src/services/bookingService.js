export async function bookTicket({ ticketId, userId, quantity }) {
    try {
        const res = await fetch("http://localhost:8000/plane/book", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ticket_id: ticketId,
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
