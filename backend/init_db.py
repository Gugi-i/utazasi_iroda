import os
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from dotenv import load_dotenv
from backend.add_samples import insert_sample_data
from backend.create_tables import create_all_tables as create_tables

load_dotenv()

DB_NAME = os.getenv("database")
DB_USER = os.getenv("user")
DB_PASS = os.getenv("password")
DB_HOST = os.getenv("host")

def create_database_if_not_exists():
    try:
        conn = psycopg2.connect(
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS,
            host=DB_HOST
        )
        conn.close()
    except:
        conn = psycopg2.connect(
            database="postgres",
            user=DB_USER,
            password=DB_PASS,
            host=DB_HOST
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()
        cur.execute(f"CREATE DATABASE {DB_NAME};")
        cur.close()
        conn.close()


def table_is_empty(cursor, table_name):
    cursor.execute(f'SELECT COUNT(*) FROM "{table_name}";')
    count = cursor.fetchone()[0]
    return count == 0

def insert_samples_if_needed():
    conn = psycopg2.connect(
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
        host=DB_HOST
    )
    cur = conn.cursor()


    needs_insert = False

    for table in ["Car", "PlaneTickets", "Accommodation", "User"]:
        if table_is_empty(cur, table):
            needs_insert = True

    if needs_insert:
        insert_sample_data(conn) 
    else:
        print("Tables already contain data. Skipping sample insert.")

    conn.commit()
    cur.close()
    conn.close()

def init_database():
    create_database_if_not_exists()
    create_tables()
    insert_samples_if_needed()
