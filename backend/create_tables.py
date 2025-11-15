from dotenv import load_dotenv
import os
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

load_dotenv()

conn = psycopg2.connect(
    host=os.getenv("host"),
    database=os.getenv("database"),
    user=os.getenv("user"),
    password=os.getenv("password")
)

cur = conn.cursor()


sql_commands = """
CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    date_of_birth DATE,
    address TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    personal_id VARCHAR(50),
    passport_number VARCHAR(50)
);

-- CAR TABLE
CREATE TABLE "Car" (
    id SERIAL PRIMARY KEY,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    space INT,
    city VARCHAR(100),
    price_per_day NUMERIC(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'available'
);

-- CAR_RENTED TABLE
CREATE TABLE "Car_rented" (
    id SERIAL PRIMARY KEY,
    car_id INT NOT NULL REFERENCES "Car"(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    rent_start_date DATE NOT NULL,
    rent_end_date DATE NOT NULL,
    total_price NUMERIC(10,2),
    booking_date TIMESTAMP DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'booked'
);

-- PLANETICKETS TABLE
CREATE TABLE "PlaneTickets" (
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
    total_seats INT NOT NULL,
    class VARCHAR(50),
    status VARCHAR(50) DEFAULT 'available'
);

-- PLANETICKETS_BOOKED TABLE
CREATE TABLE "PlaneTickets_booked" (
    id SERIAL PRIMARY KEY,
    ticket_id INT NOT NULL REFERENCES "PlaneTickets"(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    booking_date TIMESTAMP DEFAULT NOW(),
    seat_number VARCHAR(10),
    total_price NUMERIC(10,2),
    status VARCHAR(50) DEFAULT 'booked'
);

-- ACCOMMODATION TABLE
CREATE TABLE "Accommodation" (
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

-- ACCOMMODATION_BOOKED TABLE
CREATE TABLE "Accommodation_booked" (
    id SERIAL PRIMARY KEY,
    accommodation_id INT NOT NULL REFERENCES "Accommodation"(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_price NUMERIC(10,2),
    booking_date TIMESTAMP DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'booked'
);

-- JOURNEY TABLE
CREATE TABLE "Journey" (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    total_price NUMERIC(10,2),
    booking_date TIMESTAMP DEFAULT NOW(),
    start_date DATE,
    end_date DATE,
    number_of_people INT,
    status VARCHAR(50) DEFAULT 'planned'
);

-- JOURNEY_PLANETICKETS TABLE
CREATE TABLE "Journey_PlaneTickets" (
    id SERIAL PRIMARY KEY,
    journey_id INT NOT NULL REFERENCES "Journey"(id) ON DELETE CASCADE,
    plane_ticket_booked_id INT NOT NULL REFERENCES "PlaneTickets_booked"(id) ON DELETE CASCADE
);

-- JOURNEY_CARS TABLE
CREATE TABLE "Journey_Cars" (
    id SERIAL PRIMARY KEY,
    journey_id INT NOT NULL REFERENCES "Journey"(id) ON DELETE CASCADE,
    car_rented_id INT NOT NULL REFERENCES "Car_rented"(id) ON DELETE CASCADE
);

-- JOURNEY_ACCOMMODATION TABLE
CREATE TABLE "Journey_Accommodation" (
    id SERIAL PRIMARY KEY,
    journey_id INT NOT NULL REFERENCES "Journey"(id) ON DELETE CASCADE,
    accommodation_booked_id INT NOT NULL REFERENCES "Accommodation_booked"(id) ON DELETE CASCADE
);
"""

cur.execute(sql_commands)


conn.commit()

cur.close()
conn.close()