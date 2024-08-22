# init_db.py
from .db_connection import conn
import uuid
import time


def execute_query(query, parameters=None, max_retries=3, delay=5):
  for attempt in range(max_retries):
    try:
      return conn.query(query, parameters)
    except Exception as e:
      print(
          f"Error executing query (attempt {attempt + 1}/{max_retries}): {e}")
      if attempt < max_retries - 1:
        print(f"Retrying in {delay} seconds...")
        time.sleep(delay)
      else:
        print("Max retry attempts reached.")
        raise


def init_db():
  # Erase all existing data
  erase_query = """
    MATCH (n)
    DETACH DELETE n
    """
  execute_query(erase_query)
  print("All existing data has been erased.")

  # Drop all constraints and indexes
  drop_constraints_query = """
    CALL apoc.schema.assert({}, {})
    """
  execute_query(drop_constraints_query)
  print("All constraints and indexes have been dropped.")

  # Create constraints with updated syntax
  constraints = [
      "CREATE CONSTRAINT IF NOT EXISTS FOR (l:Lukon) REQUIRE l.id IS UNIQUE",
      "CREATE CONSTRAINT IF NOT EXISTS FOR (p:Problem) REQUIRE p.id IS UNIQUE",
      "CREATE CONSTRAINT IF NOT EXISTS FOR (s:Solution) REQUIRE s.id IS UNIQUE",
      "CREATE CONSTRAINT IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE"
  ]

  for constraint in constraints:
    execute_query(constraint)
    print(f"Created constraint: {constraint}")

  # Create sample data
  sample_data = [{
      "name": "Eco-Friendly Packaging",
      "description": "Develop biodegradable packaging for consumer goods",
      "problem": "Excessive plastic waste in packaging",
      "solution": "Use plant-based materials for packaging",
      "user_id": str(uuid.uuid4())
  }, {
      "name": "Urban Vertical Farming",
      "description": "Implement vertical farming techniques in urban areas",
      "problem": "Limited space for agriculture in cities",
      "solution": "Utilize vertical space for growing crops",
      "user_id": str(uuid.uuid4())
  }, {
      "name": "AI-Powered Education",
      "description": "Personalized learning experiences using AI",
      "problem": "One-size-fits-all approach in education",
      "solution": "AI algorithms to tailor educational content",
      "user_id": str(uuid.uuid4())
  }]

  for data in sample_data:
    query = """
        CREATE (l:Lukon {id: $lukon_id, name: $name, description: $description, created_at: datetime()})
        CREATE (p:Problem {id: $problem_id, description: $problem_description})
        CREATE (s:Solution {id: $solution_id, description: $solution_description})
        CREATE (u:User {id: $user_id})
        CREATE (u)-[:CREATES]->(l)
        CREATE (l)-[:HAS]->(p)
        CREATE (l)-[:HAS]->(s)
        """

    parameters = {
        'lukon_id': str(uuid.uuid4()),
        'name': data['name'],
        'description': data['description'],
        'problem_id': str(uuid.uuid4()),
        'problem_description': data['problem'],
        'solution_id': str(uuid.uuid4()),
        'solution_description': data['solution'],
        'user_id': data['user_id']
    }

    execute_query(query, parameters)
    print(f"Created Lukon: {data['name']}")


if __name__ == "__main__":
  init_db()
  print("Database initialization completed.")
  conn.close()
