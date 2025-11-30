def insert_sample_data(conn):
    cur = conn.cursor()
    
    # -------------------------
    # PERSONS
    # -------------------------
    persons = [
        ("John Doe", "john@example.com", "hashedpassword123", "user"),
        ("Anna Worker", "anna@work.com", "hashedpassword456", "worker"),
    ]

    for person in persons:
        # Insert only the role into Person
        cur.execute("""
            INSERT INTO "Person" (role)
            VALUES (%s)
            RETURNING id
        """, (person[3],))

        person_id = cur.fetchone()[0]

        if person[3] == "user":
            # Insert credentials into User
            cur.execute("""
                INSERT INTO "User" (id, name, email, password_hash)
                VALUES (%s, %s, %s, %s)
            """, (person_id, person[0], person[1], person[2]))
        else:
            # Insert credentials into Worker
            cur.execute("""
                INSERT INTO "Worker" (id, name, email, password_hash)
                VALUES (%s, %s, %s, %s)
            """, (person_id, person[0], person[1], person[2]))



    # -------------------------
    # CARS
    # -------------------------
    cars = [
        ("img/toyota_corolla.jpg", "Toyota", "Corolla", 2020, 5, "London", 30.0, "available"),
        ("img/honda_civic.jpg", "Honda", "Civic", 2019, 5, "Berlin", 28.0, "available"),
        ("img/bmw_x3.jpg", "BMW", "X3", 2021, 7, "Paris", 50.0, "available"),
        ("img/audi_a4.jpg", "Audi", "A4", 2020, 5, "Rome", 45.0, "available"),
        ("img/ford_focus.jpg", "Ford", "Focus", 2018, 5, "New York", 40.0, "available"),
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
        ("FL101", "WizzAir", "Budapest", "London",
         "2025-01-01 10:00", "2025-01-01 13:00", "03:00",
         120.0, 150, 150),

        ("FL102", "Ryanair", "Berlin", "Paris",
         "2025-02-15 09:00", "2025-02-15 11:00", "02:00",
         90.0, 120, 120),

        ("FL103", "LOT", "Rome", "Berlin",
         "2025-03-10 14:00", "2025-03-10 16:00", "02:00",
         110.0, 100, 100),

        ("FL104", "AirFrance", "Paris", "Rome",
         "2025-04-01 08:30", "2025-04-01 11:00", "02:30",
         140.0, 80, 80),

        ("FL105", "Delta", "New York", "London",
         "2025-05-20 06:00", "2025-05-20 13:00", "07:00",
         500.0, 200, 200),
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
    ("img/london_central_hotel.jpg", "London Central Hotel", "London", "Hotel",
     "Central hotel in London"),

    ("img/berlin_cozy_inn.jpg", "Berlin Cozy Inn", "Berlin", "Guesthouse",
     "Cozy guesthouse near city center"),

    ("img/paris_apartments.jpg", "Paris Apartments", "Paris", "Apartment",
     "Modern apartments with kitchen"),

    ("img/rome_hostel.jpg", "Rome Hostel", "Rome", "Hostel",
     "Budget-friendly hostel near Colosseum"),

    ("img/nyc_luxury_suites.jpg", "NYC Luxury Suites", "New York", "Hotel",
     "Luxury suites in Manhattan"),
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

    # Berlin (2)
    (2, 2, 15, 70.00),
    (2, 3, 10, 95.00),

    # Paris (3)
    (3, 2, 10, 110.00),
    (3, 4, 10, 150.00),

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
