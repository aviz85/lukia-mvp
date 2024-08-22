# app/db_connection.py

from neo4j import GraphDatabase
from neo4j.exceptions import ServiceUnavailable, SessionExpired
from config import Config
import sys
import time


class Neo4jConnection:

    def __init__(self, uri, user, password, max_retry=3, retry_delay=5):
        self.uri = uri
        self.user = user
        self.password = password
        self.driver = None
        self.max_retry = max_retry
        self.retry_delay = retry_delay
        self._connect()

    def _connect(self):
        for attempt in range(self.max_retry):
            try:
                self.driver = GraphDatabase.driver(self.uri,
                                                   auth=(self.user,
                                                         self.password))
                print("Successfully connected to Neo4j AuraDB instance")
                return
            except Exception as e:
                print(
                    f"Error connecting to Neo4j AuraDB (attempt {attempt + 1}/{self.max_retry}): {e}",
                    file=sys.stderr)
                if attempt < self.max_retry - 1:
                    print(f"Retrying in {self.retry_delay} seconds...")
                    time.sleep(self.retry_delay)
                else:
                    print("Max retry attempts reached. Exiting.")
                    sys.exit(1)

    def close(self):
        if self.driver is not None:
            self.driver.close()

    def query(self, query, parameters=None):
        assert self.driver is not None, "Driver not initialized!"
        session = None
        response = None
        retry_count = 0
        while retry_count < self.max_retry:
            try:
                session = self.driver.session()
                response = list(session.run(query, parameters))
                return response
            except (ServiceUnavailable, SessionExpired) as e:
                print(
                    f"Connection error (attempt {retry_count + 1}/{self.max_retry}): {e}"
                )
                retry_count += 1
                if retry_count < self.max_retry:
                    print(f"Retrying in {self.retry_delay} seconds...")
                    time.sleep(self.retry_delay)
                else:
                    print("Max retry attempts reached.")
                    raise
            except Exception as e:
                print(f"Query failed: {e}")
                raise
            finally:
                if session is not None:
                    session.close()


# Initialize the database connection
conn = Neo4jConnection(Config.NEO4J_URI, Config.NEO4J_USER,
                       Config.NEO4J_PASSWORD)
