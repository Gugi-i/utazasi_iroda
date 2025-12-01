import hashlib

def insert_sample_data(conn):
    cur = conn.cursor()
    
    # -------------------------
    # PERSONS
    # -------------------------
    persons = [
        ("John", "john@example.com", "123", "user"),
        ("Anna", "anna@work.com", "456", "worker"),
        ("Maria", "maria@work.com", "789", "worker"),
        ("Peter", "peter@work.com", "abc", "worker"),
    ]

    for person in persons:
        cur.execute("""
            INSERT INTO "Person" (role)
            VALUES (%s)
            RETURNING id
        """, (person[3],))
        person_id = cur.fetchone()[0]

        pwd_hash = hashlib.sha256(person[2].encode()).hexdigest()

        if person[3] == "user":
            cur.execute("""
                INSERT INTO "User" (id, name, email, password_hash)
                VALUES (%s, %s, %s, %s)
            """, (person_id, person[0], person[1], pwd_hash))
        else:
            cur.execute("""
                INSERT INTO "Worker" (id, name, email, password_hash)
                VALUES (%s, %s, %s, %s)
            """, (person_id, person[0], person[1], pwd_hash))

    # -------------------------
    # CARS
    # -------------------------
    cars = [
        ("https://media.istockphoto.com/id/2150902357/photo/a-white-toyota-corolla-cruising-near-herman-park-in-houston.jpg?s=612x612&w=0&k=20&c=VQmXv-7fOFxPNfkE9CPZphGmwOFrzB5PlDfCL8oOP1A%3D", "Toyota", "Corolla", 2020, 5, "London", 30.0, "available"),
        ("https://www.shutterstock.com/image-photo/nonthaburithailandmarch-2021-honda-civic-18el-600nw-1948301173.jpg", "Honda", "Civic", 2019, 5, "Berlin", 28.0, "available"),
        ("https://media.istockphoto.com/id/2168815142/photo/bmw-x3-m40i-display-at-a-dealership-bmw-offers-the-x3-with-a-382hp-3-0l-turbocharged-6.jpg?s=612x612&w=0&k=20&c=mFk9FGJalaWHt9t0o9stjH8paxZYqWLKuaeUgqZ4-mY%3D", "BMW", "X3", 2021, 7, "Paris", 50.0, "available"),
        ("https://www.shutterstock.com/image-photo/st-petersburg-russia-september-19-600nw-2045174033.jpg", "Audi", "A4", 2020, 5, "Rome", 45.0, "available"),
        ("https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?cs=srgb&dl=pexels-mikebirdy-1007410.jpg&fm=jpg", "Ford", "Focus", 2018, 5, "New York", 40.0, "available"),
        ("https://media.istockphoto.com/id/503663884/photo/mercedes-c-class-stopped-on-the-road.jpg?s=612x612&w=0&k=20&c=EMEDWT042FPLGh6NcUZFPdiKzX3m6avGqE0hQI50im0%3D", "Mercedes", "C-Class", 2022, 5, "London", 55.0, "available"),
        ("https://resource.digitaldealer.com.au/image/92682636768fc0bcd3177d658897426_600_400-c.jpg", "Volvo", "XC90", 2021, 7, "Paris", 60.0, "available"),
    ]

    for car in cars:
        cur.execute("""
            INSERT INTO "Car" (image_url, make, model, year, space, city, price_per_day, status)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
        """, car)

    # -------------------------
    # FLIGHTS
    # -------------------------
    flights = [
        ("FL101", "WizzAir", "Budapest", "London", "2026-01-01 10:00", "2026-01-01 13:00", "03:00", 120.0, 150, 150),
        ("FL102", "Ryanair", "Berlin", "Paris", "2026-02-15 09:00", "2026-02-15 11:00", "02:00", 90.0, 120, 120),
        ("FL103", "LOT", "Rome", "Berlin", "2026-03-10 14:00", "2026-03-10 16:00", "02:00", 110.0, 100, 100),
        ("FL104", "AirFrance", "Paris", "Rome", "2026-04-01 08:30", "2026-04-01 11:00", "02:30", 140.0, 80, 80),
        ("FL105", "Delta", "New York", "London", "2026-05-20 06:00", "2026-05-20 13:00", "07:00", 500.0, 200, 200),
        ("FL106", "British Airways", "London", "Paris", "2026-01-05 09:00", "2026-01-05 11:00", "02:00", 130.0, 100, 100),
        ("FL107", "Lufthansa", "Berlin", "Rome", "2026-02-20 12:00", "2026-02-20 14:30", "02:30", 150.0, 90, 90),
    ]

    for flight in flights:
        cur.execute("""
            INSERT INTO "PlaneTickets"
            (flight_number, airline, departure_city, arrival_city,
            departure_date, arrival_date, duration, price,
            seats_available, total_seats)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, flight)

    # -------------------------
    # ACCOMMODATIONS
    # -------------------------
    accommodations = [
        ("https://media.istockphoto.com/id/1050564510/photo/3d-rendering-beautiful-luxury-bedroom-suite-in-hotel-with-tv.jpg?s=612x612&w=0&k=20&c=ZYEso7dgPl889aYddhY2Fj3GOyuwqliHkbbT8pjl_iM%3D", "London Central Hotel", "London", "Hotel", "Central hotel in London"),
        ("https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3Vlc3QlMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D", "Berlin Cozy Inn", "Berlin", "Guesthouse", "Cozy guesthouse near city center"),
        ("https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80", "Paris Apartments", "Paris", "Apartment", "Modern apartments with kitchen"),
        ("https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80", "Rome Hostel", "Rome", "Hostel", "Budget-friendly hostel near Colosseum"),
        ("https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80", "NYC Luxury Suites", "New York", "Hotel", "Luxury suites in Manhattan"),
        ("https://images.unsplash.com/photo-1631049307264-da0ec9d70304?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG90ZWwlMjByb29tfGVufDB8fDB8fHww", "London Boutique", "London", "Hotel", "Boutique hotel in London"),
        ("https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80", "Paris Luxury Suites", "Paris", "Hotel", "Luxury hotel near Eiffel Tower"),
    ]

    for acc in accommodations:
        cur.execute("""
            INSERT INTO "Accommodation"
            (image_url, name, location, type, description)
            VALUES (%s,%s,%s,%s,%s)
        """, acc)

    room_types = [
        # London (1)
        (1, 1, 20, 80.00),
        (1, 2, 20, 120.00),
        (1, 4, 10, 180.00),
        (6, 2, 10, 200.00),

        # Berlin (2)
        (2, 2, 15, 70.00),
        (2, 3, 10, 95.00),

        # Paris (3)
        (3, 2, 10, 110.00),
        (3, 4, 10, 150.00),
        (7, 2, 5, 220.00),

        # Rome Hostel (4)
        (4, 1, 40, 25.00),

        # NYC (5)
        (5, 2, 10, 300.00),
        (5, 3, 10, 380.00),
        (5, 4, 5, 450.00),
    ]

    for rt in room_types:
        cur.execute("""
            INSERT INTO "AccommodationRoomType"
            (accommodation_id, room_capacity, total_rooms, price_per_night)
            VALUES (%s,%s,%s,%s)
        """, rt)
    
    conn.commit()
    cur.close()
