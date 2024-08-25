import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db_connection import conn

def cleanup_database():
    # Delete all nodes and relationships
    conn.query("MATCH (n) DETACH DELETE n")
    print("All nodes and relationships have been deleted from the database.")

if __name__ == "__main__":
    cleanup_database()
    conn.close()