/**
 * Mock API call to cancel a booking.
 * Replace the console logs and Promise.resolve with actual fetch calls.
 */
export const cancelBookingApi = async (bookingId) => {
    console.log(`[API Service] Initiating cancellation for booking ID: ${bookingId}...`);

    // --- Placeholder for actual API call ---
    /*
    try {
        const response = await fetch(`/api/bookings/${bookingId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
    */
    // ---------------------------------------

    // Simulate network delay and success response
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`[API Service] Booking ${bookingId} cancelled successfully.`);
            resolve({ success: true, message: "Booking cancelled" });
        }, 500);
    });
};

/**
 * Mock API call to fetch user bookings.
 */
export const getBookingsApi = async () => {
    console.log(`[API Service] Fetching user bookings...`);

    // --- Placeholder for actual API call ---
    /*
    try {
        const response = await fetch('/api/bookings', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
    */
    // ---------------------------------------

    // Simulate network delay and return mock data
    return new Promise((resolve) => {
        setTimeout(() => {
            const mockData = [
                {
                    id: 1,
                    accommodation_id: 101,
                    user_id: 5,
                    check_in_date: "2024-06-01",
                    check_out_date: "2024-06-05",
                    total_price: 796, // Assuming 4 nights @ 199
                    booking_date: "2024-01-15",
                    status: "Completed",
                    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
                    // Include display details not in schema but needed for UI:
                    name: "Grand Plaza Hotel",
                    type: "Hotel",
                    room: "Standard Room",
                    location: "Paris"
                },
                {
                    id: 2,
                    accommodation_id: 205,
                    user_id: 5,
                    check_in_date: "2024-06-10",
                    check_out_date: "2024-06-15",
                    total_price: 2250, // Assuming 5 nights @ 450
                    booking_date: "2024-02-20",
                    status: "Active",
                    imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80",
                    // Include display details not in schema but needed for UI:
                    name: "Seaside Bliss Resort",
                    type: "Resort",
                    room: "Ocean View Suite",
                    location: "Maui"
                },
                {
                    id: 3,
                    accommodation_id: 308,
                    user_id: 5,
                    check_in_date: "2024-12-20",
                    check_out_date: "2024-12-25",
                    total_price: 1750, // Assuming 5 nights @ 350
                    booking_date: "2024-05-10",
                    status: "Confirmed",
                    imageUrl: "https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?auto=format&fit=crop&w=800&q=80",
                    // Include display details not in schema but needed for UI:
                    name: "Alpine Cozy Cabin", // Note: Fixed name from previous copy/paste error in your snippet
                    type: "Cabin",
                    room: "Entire Cabin",
                    location: "Aspen"
                },
            ];
            console.log(`[API Service] Bookings fetched.`);
            resolve(mockData);
        }, 500);
    });
};
