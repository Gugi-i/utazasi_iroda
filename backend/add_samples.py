def insert_sample_data(conn):
    cur = conn.cursor()

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
         120.0, 150, 150, "Economy", "available"),

        ("FL102", "Ryanair", "Berlin", "Paris",
         "2025-02-15 09:00", "2025-02-15 11:00", "02:00",
         90.0, 120, 120, "Economy", "available"),

        ("FL103", "LOT", "Rome", "Berlin",
         "2025-03-10 14:00", "2025-03-10 16:00", "02:00",
         110.0, 100, 100, "Economy", "available"),

        ("FL104", "AirFrance", "Paris", "Rome",
         "2025-04-01 08:30", "2025-04-01 11:00", "02:30",
         140.0, 80, 80, "Economy", "available"),

        ("FL105", "Delta", "New York", "London",
         "2025-05-20 06:00", "2025-05-20 13:00", "07:00",
         500.0, 200, 200, "Economy", "available"),
    ]

    for flight in flights:
        cur.execute("""
            INSERT INTO "PlaneTickets"
            (flight_number, airline, departure_city, arrival_city,
            departure_date, arrival_date, duration, price,
            seats_available, total_seats, class, status)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, flight)

    # -------------------------
    # ACCOMMODATIONS
    # -------------------------
    accommodations = [
        ("London Central Hotel", "London", "Hotel",
         "Central hotel in London", 50, 2, 120.0, "available"),

        ("Berlin Cozy Inn", "Berlin", "Guesthouse",
         "Cozy guesthouse near city center", 30, 2, 80.0, "available"),

        ("Paris Apartments", "Paris", "Apartment",
         "Modern apartments with kitchen", 20, 4, 100.0, "available"),

        ("Rome Hostel", "Rome", "Hostel",
         "Budget-friendly hostel near Colosseum", 40, 1, 35.0, "available"),

        ("NYC Luxury Suites", "New York", "Hotel",
         "Luxury suites in Manhattan", 25, 3, 250.0, "available"),
    ]

    for acc in accommodations:
        cur.execute("""
            INSERT INTO "Accommodation"
            (name, location, type, description, room, capacity, price_per_night, status)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
        """, acc)

    # -------------------------
    # USER SAMPLE
    # -------------------------
    user = ("admin", "admin@example.com", "admin123", "admin")

    cur.execute("""
        INSERT INTO "User" (username, email, password, role)
        VALUES (%s, %s, %s, %s)
    """, user)

    # -------------------------

    conn.commit()
    cur.close()
