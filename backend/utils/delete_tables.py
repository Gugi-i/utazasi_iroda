import os
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from dotenv import load_dotenv

load_dotenv()

DB_NAME = os.getenv("database")
DB_USER = os.getenv("user")
DB_PASS = os.getenv("password")
DB_HOST = os.getenv("host")


def drop_database():
    try:
        conn = psycopg2.connect(
            database="postgres",
            user=DB_USER,
            password=DB_PASS,
            host=DB_HOST
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()


        cur.execute(
            "SELECT 1 FROM pg_database WHERE datname = %s;", (DB_NAME,)
        )

        if not cur.fetchone():
            return


        cur.execute(f"""
            SELECT pg_terminate_backend(pid)
            FROM pg_stat_activity
            WHERE datname = '{DB_NAME}'
              AND pid <> pg_backend_pid();
        """)

        cur.execute(f"DROP DATABASE {DB_NAME};")

        cur.close()
        conn.close()


    except Exception as e:
        print("Hiba történt az adatbázis törlése során:", e)


def drop_all_tables_instead():
    try:
        conn = psycopg2.connect(
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS,
            host=DB_HOST
        )
        cur = conn.cursor()

        cur.execute("""
            SELECT tablename
            FROM pg_tables
            WHERE schemaname = 'public';
        """)

        tables = cur.fetchall()

        if not tables:
            return

        for (table,) in tables:
            cur.execute(f'DROP TABLE "{table}" CASCADE;')

        conn.commit()
        cur.close()
        conn.close()

    except Exception as e:
        print("Hiba történt a táblák törlése során:", e)

if __name__ == "__main__":
    print("**********************************************")
    print("FIGYELEM! Ez a script törli az egész database-t!")
    print("**********************************************")
    confirm = input(f"Biztosan törölni akarod a(z) '{DB_NAME}' adatbázist? (igen/nem): ")

    if confirm.lower() == "igen":
        drop_database()
    else:
        print("Művelet megszakítva.")
