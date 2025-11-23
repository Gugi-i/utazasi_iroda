from dotenv import load_dotenv
import os
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

load_dotenv()

def create_all_tables():
    conn = psycopg2.connect(
        host=os.getenv("host"),
        database=os.getenv("database"),
        user=os.getenv("user"),
        password=os.getenv("password")
    )

    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = conn.cursor()

    sql_commands = """
    CREATE TABLE IF NOT EXISTS "User" (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "Car" (
        id SERIAL PRIMARY KEY,
        make VARCHAR(100) NOT NULL,
        model VARCHAR(100) NOT NULL,
        year INT NOT NULL,
        space INT,
        city VARCHAR(100),
        price_per_day NUMERIC(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'available'
    );

    CREATE TABLE IF NOT EXISTS "Car_rented" (
        id SERIAL PRIMARY KEY,
        car_id INT NOT NULL REFERENCES "Car"(id) ON DELETE CASCADE,
        user_id INT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL,
        total_price NUMERIC(10,2),
        booking_date TIMESTAMP DEFAULT NOW(),
        status VARCHAR(50) DEFAULT 'booked'
    );

    CREATE TABLE IF NOT EXISTS "PlaneTickets" (
        id SERIAL PRIMARY KEY,
        flight_number VARCHAR(50) NOT NULL,
        airline VARCHAR(100) NOT NULL,
        departure_city VARCHAR(100) NOT NULL,
        arrival_city VARCHAR(100) NOT NULL,
        departure_date TIMESTAMP NOT NULL,
        arrival_date TIMESTAMP NOT NULL,
        duration INTERVAL,
        price NUMERIC(10,2) NOT NULL,
        seats_available INT NOT NULL,
        total_seats INT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "PlaneTickets_booked" (
        id SERIAL PRIMARY KEY,
        ticket_id INT NOT NULL REFERENCES "PlaneTickets"(id) ON DELETE CASCADE,
        user_id INT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        seat_number VARCHAR(10),
        total_price NUMERIC(10,2)
    );

    CREATE TABLE IF NOT EXISTS "Accommodation" (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        type VARCHAR(50),
        description TEXT,
        room INT,
        capacity INT,
        price_per_night NUMERIC(10,2),
        status VARCHAR(50) DEFAULT 'available'
    );

    CREATE TABLE IF NOT EXISTS "Accommodation_booked" (
        id SERIAL PRIMARY KEY,
        accommodation_id INT NOT NULL REFERENCES "Accommodation"(id) ON DELETE CASCADE,
        user_id INT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        check_in_date DATE NOT NULL,
        check_out_date DATE NOT NULL,
        total_price NUMERIC(10,2),
        booking_date TIMESTAMP DEFAULT NOW(),
        status VARCHAR(50) DEFAULT 'booked'
    );

    CREATE TABLE IF NOT EXISTS "Journey" (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        total_price NUMERIC(10,2),
        booking_date TIMESTAMP DEFAULT NOW(),
        start_date DATE,
        end_date DATE,
        number_of_people INT,
        status VARCHAR(50) DEFAULT 'planned'
    );

    CREATE TABLE IF NOT EXISTS "Journey_PlaneTickets" (
        id SERIAL PRIMARY KEY,
        journey_id INT NOT NULL REFERENCES "Journey"(id) ON DELETE CASCADE,
        plane_ticket_booked_id INT NOT NULL REFERENCES "PlaneTickets_booked"(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "Journey_Cars" (
        id SERIAL PRIMARY KEY,
        journey_id INT NOT NULL REFERENCES "Journey"(id) ON DELETE CASCADE,
        car_rented_id INT NOT NULL REFERENCES "Car_rented"(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "Journey_Accommodation" (
        id SERIAL PRIMARY KEY,
        journey_id INT NOT NULL REFERENCES "Journey"(id) ON DELETE CASCADE,
        accommodation_booked_id INT NOT NULL REFERENCES "Accommodation_booked"(id) ON DELETE CASCADE
    );
    """

    cur.execute(sql_commands)

    conn.commit()
    cur.close()
    conn.close()

