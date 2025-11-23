export async function searchCars(filters) {
    const params = new URLSearchParams();

    console.log("Searching using:", filters);
    const allCars = [
        { id: 1, name: 'Nissan Altima', pricePerDay: 50.00, imageUrl: 'src/assets/car2.jpg' },
        { id: 2, name: 'Toyota RAV4', pricePerDay: 65.00, imageUrl: 'src/assets/car3.jpg' },
        { id: 3, name: 'Fiat 500', pricePerDay: 40.00, imageUrl: 'src/assets/car1.jpg' },
        { id: 4, name: 'Honda Civic', pricePerDay: 55.00, imageUrl: 'src/assets/car4.jpg' },
        { id: 5, name: 'Ford Mustang', pricePerDay: 80.00, imageUrl: 'src/assets/car5.jpg' },
        { id: 6, name: 'Chevrolet Malibu', pricePerDay: 60.00, imageUrl: 'src/assets/car6.jpg' },
    ];


    //const url = `http://localhost:8000/cars?${params.toString()}`;
    /*const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Car search failed: " + response.status);
    }

    return response.json();*/

    return allCars;
}
