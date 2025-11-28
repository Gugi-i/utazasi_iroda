// Example usage inside a parent component
import HotelCard from './HotelCard';

const dummyHotels = [
    {
        id: 1,
        name: "Grand Plaza Hotel",
        location: "Paris, 0.5km from center",
        type: "Hotel",
        description: "A luxury hotel featuring a pool, spa, and complimentary breakfast.",
        room: "Standard Room",
        capacity: 2,
        price_per_night: 199,
        status: "Available",
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        name: "Eiffel View Suites",
        location: "Paris, 1.2km from center",
        type: "Apartment",
        description: "Spacious suites with city views and kitchenette facilities.",
        room: "Deluxe Suite",
        capacity: 4,
        price_per_night: 245,
        status: "Available",
        imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        name: "Seaside Bliss Resort",
        location: "Maui, Beachfront",
        type: "Resort",
        description: "Relaxing beachfront stay with private balcony and ocean breeze.",
        room: "Ocean View King",
        capacity: 2,
        price_per_night: 450,
        status: "Booked",
        imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 4,
        name: "Urban Loft Downtown",
        location: "New York, Soho",
        type: "Apartment",
        description: "Modern open-plan loft in the heart of the fashion district.",
        room: "Studio",
        capacity: 2,
        price_per_night: 210,
        status: "Available",
        imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 5,
        name: "Backpacker's Haven",
        location: "Berlin, Mitte",
        type: "Hostel",
        description: "Budget-friendly accommodation with shared lounge and kitchen.",
        room: "Bunk in Dorm",
        capacity: 1,
        price_per_night: 35,
        status: "Available",
        imageUrl: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 6,
        name: "City Center Inn",
        location: "London, 0.2km from center",
        type: "Hotel",
        description: "Conveniently located hotel with modern rooms and easy access to public transport.",
        room: "Double Room",
        capacity: 2,
        price_per_night: 150,
        status: "Available",
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
    }
];

function HotelList() {
    const handleBook = (hotel) => {
        console.log("Booking hotel:", hotel.name);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
            {dummyHotels.map(hotel => (
                <HotelCard key={hotel.id} hotel={hotel} onBook={handleBook} />
            ))}
        </div>
    );
}

export default HotelList;
