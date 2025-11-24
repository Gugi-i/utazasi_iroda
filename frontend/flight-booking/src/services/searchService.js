export async function searchTickets(filters) {
    const params = new URLSearchParams();

    console.log("Searching using:", filters);
    const allTickets = [
        { id: 1, name: 'Nissan Altima', price: 50.00},
        { id: 2, name: 'Toyota RAV4', price: 65.00},
        { id: 3, name: 'Fiat 500', price: 40.00},
        { id: 4, name: 'Honda Civic', price: 55.00},
        { id: 5, name: 'Ford Mustang', price: 80.00},
        { id: 6, name: 'Chevrolet Malibu', price: 60.00},
    ];


    //const url = `http://localhost:8000/cars?${params.toString()}`;
    /*const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Car search failed: " + response.status);
    }

    return response.json();*/

    return allTickets;
}