import psycopg2

def get_connection():
    return psycopg2.connect(
        host="localhost",
        port=5435,
        database="postgres",
        user="postread",
        password="PostRead"
    )