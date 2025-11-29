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

Https használatához szükség van egy tanúsítványra és egy kulcsra, amit a certs mappába kell elhelyezni.

Ehhez telepíteni kell a számítógépre a mkcert-et: 
1. choco install mkcert
2. mkcert -install

A tanúsítvány és kulcs létrehozásához az alábbi parancsra van szükség a certs könyvtárban:

mkcert localhost

Ezek után az alábbi paranccsal lehet elindítani a backend-et https-el:

uvicorn backend.main:app --reload --ssl-keyfile=../certs/localhost-key.pem --ssl-certfile=../certs/localhost.pem
