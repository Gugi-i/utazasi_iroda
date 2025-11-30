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
    CREATE TABLE IF NOT EXISTS "Person" (
        id SERIAL PRIMARY KEY,
        role VARCHAR(50) NOT NULL CHECK (role IN ('user','worker'))
    );

    CREATE TABLE IF NOT EXISTS "User" (
        id INT PRIMARY KEY REFERENCES "Person"(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "Worker" (
        id INT PRIMARY KEY REFERENCES "Person"(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "Car" (
        id SERIAL PRIMARY KEY,
        image_url VARCHAR(255),
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
        user_id INT NOT NULL REFERENCES "Person"(id) ON DELETE CASCADE,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL,
        total_price NUMERIC(10,2)
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
        flight_id INT NOT NULL REFERENCES "PlaneTickets"(id) ON DELETE CASCADE,
        user_id INT NOT NULL REFERENCES "Person"(id) ON DELETE CASCADE,
        flight_number VARCHAR(50) NOT NULL,
        airline VARCHAR(100) NOT NULL,
        departure_city VARCHAR(100) NOT NULL,
        arrival_city VARCHAR(100) NOT NULL,
        departure_date TIMESTAMP NOT NULL,
        arrival_date TIMESTAMP NOT NULL,
        seat_number VARCHAR(10),
        total_price NUMERIC(10,2)
    );

    CREATE TABLE IF NOT EXISTS "Accommodation" (
        id SERIAL PRIMARY KEY,
        image_url VARCHAR(255),
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,     
        description TEXT
    );
    
    CREATE TABLE IF NOT EXISTS "AccommodationRoomType" (
        id SERIAL PRIMARY KEY,
        accommodation_id INT NOT NULL REFERENCES "Accommodation"(id) ON DELETE CASCADE,
        room_capacity INT NOT NULL,        
        total_rooms INT NOT NULL,          
        price_per_night NUMERIC(10,2) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "AccommodationBooking" (
        id SERIAL PRIMARY KEY,
        accommodation_id INT NOT NULL REFERENCES "Accommodation"(id) ON DELETE CASCADE,
        room_type_id INT NOT NULL REFERENCES "AccommodationRoomType"(id) ON DELETE CASCADE,
        user_id INT NOT NULL REFERENCES "Person"(id) ON DELETE CASCADE,
        rooms_booked INT NOT NULL,               
        check_in_date DATE NOT NULL,
        check_out_date DATE NOT NULL,
        total_price NUMERIC(10,2)
    );

    CREATE TABLE IF NOT EXISTS "Journey" (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES "Person"(id) ON DELETE CASCADE,
        total_price NUMERIC(10,2),
        start_date DATE,
        end_date DATE,
        number_of_people INT
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
        accommodation_booked_id INT NOT NULL REFERENCES "AccommodationBooking"(id) ON DELETE CASCADE
    );
    """

    cur.execute(sql_commands)

    conn.commit()
    cur.close()
    conn.close()