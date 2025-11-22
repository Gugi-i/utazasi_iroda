from fastapi import APIRouter
import hashlib

router = APIRouter(prefix="/hash", tags=["Hash helper"])

@router.get("/{text}")
def hash_text(text: str):
    hashed = hashlib.sha256(text.encode()).hexdigest()
    return {"hash": hashed}
