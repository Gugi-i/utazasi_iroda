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
        cur.execute("""
            INSERT INTO "Person" (name, email, password_hash, type)
            VALUES (%s, %s, %s, %s)
            RETURNING id
        """, person)

        person_id = cur.fetchone()[0]

        if person[3] == "user":
            cur.execute('INSERT INTO "User" (id) VALUES (%s)', (person_id,))
        else:
            cur.execute('INSERT INTO "Worker" (id) VALUES (%s)', (person_id,))


    # -------------------------
    # CARS
    # -------------------------
    cars = [
        ("Toyota", "Corolla", 2020, 5, "London", 30.0, "available"),
        ("Honda", "Civic", 2019, 5, "Berlin", 28.0, "available"),
        ("BMW", "X3", 2021, 7, "Paris", 50.0, "available"),
        ("Audi", "A4", 2020, 5, "Rome", 45.0, "available"),
        ("Ford", "Focus", 2018, 5, "New York", 40.0, "available"),
    ]

    for car in cars:
        cur.execute("""
            INSERT INTO "Car" (make, model, year, space, city, price_per_day, status)
            VALUES (%s,%s,%s,%s,%s,%s,%s)
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
    ("London Central Hotel", "London", "Hotel",
     "Central hotel in London"),

    ("Berlin Cozy Inn", "Berlin", "Guesthouse",
     "Cozy guesthouse near city center"),

    ("Paris Apartments", "Paris", "Apartment",
     "Modern apartments with kitchen"),

    ("Rome Hostel", "Rome", "Hostel",
     "Budget-friendly hostel near Colosseum"),

    ("NYC Luxury Suites", "New York", "Hotel",
     "Luxury suites in Manhattan"),
]

    for acc in accommodations:
        cur.execute("""
            INSERT INTO "Accommodation"
            (name, location, type, description)
            VALUES (%s,%s,%s,%s)
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
