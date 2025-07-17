import os
import psycopg2

DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT', '5432')

conn = psycopg2.connect(
    dbname=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=DB_PORT
)
cur = conn.cursor()

cur.execute("SELECT tablename FROM pg_tables WHERE schemaname = current_schema();")
tables = cur.fetchall()

if tables:
    print('Tables in the database:')
    for t in tables:
        print('-', t[0])
else:
    print('No tables found in the database.')

cur.close()
conn.close() 