def verify_password(hashed_from_frontend: str, hashed_in_db: str) -> bool:
    return hashed_from_frontend == hashed_in_db

