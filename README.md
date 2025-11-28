A projekt github repo-ja.
Ha valami nagy kagi, vagy change van ide írjuk bele, mert ez látványos!

PostgreSQL telepítése és adatázis létrehozása

telepítő telepítése erről az oldalról: https://www.postgresql.org/download/windows/

telepítőnél komponensek küzül PostgreSQL és pgAdmin 4 telepítése

postgres-nek beállítani egy jelszót

C:\Program Files\PostgreSQL\ ide fog telepedni, ennek a bin mappáját be kell állítani környezeti váltózóként

a backend mappában python -m venv venv paranccsal python virtuális environment létrehozása

pip install -r requirements.txt futtatása

root mappába .env file elhelyezése

Majd ezzel a paranccsal lehet elindítani a backend-et: uvicorn backend.main:app --reload