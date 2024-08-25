import sys
import os
import random
from faker import Faker

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models import Lukon, User
from app.db_connection import conn

# Initialize Faker
fake = Faker()

def create_random_lukons(num_lukons=20):
    # Create a test user
    user_id = User.create('Random Creator', 'random@example.com')

    # List of potential tags
    tags = ['Technology', 'Environment', 'Health', 'Education', 'Finance', 'Social', 'Art', 'Science']

    for _ in range(num_lukons):
        # Generate random data for Lukon
        name = fake.catch_phrase()
        description = fake.text(max_nb_chars=200)
        problem = fake.sentence()
        solution = fake.sentence()

        # Create the Lukon
        lukon_id = Lukon.create(name, description, problem, solution, user_id)

        # Add random tags (1 to 3 tags)
        num_tags = random.randint(1, 3)
        for _ in range(num_tags):
            Lukon.add_tag(lukon_id, random.choice(tags))

        # Add random comments (0 to 3 comments)
        num_comments = random.randint(0, 3)
        for _ in range(num_comments):
            Lukon.add_comment(lukon_id, user_id, fake.sentence())

        # Suggest additional problems and solutions (0 to 2 each)
        num_problems = random.randint(0, 2)
        num_solutions = random.randint(0, 2)
        for _ in range(num_problems):
            Lukon.suggest_problem(lukon_id, user_id, fake.sentence())
        for _ in range(num_solutions):
            Lukon.suggest_solution(lukon_id, user_id, fake.sentence())

        # Randomly mark as interesting (50% chance)
        if random.choice([True, False]):
            Lukon.mark_as_interesting(lukon_id, user_id)

        print(f"Created Lukon: {name}")

    print(f"Created {num_lukons} random Lukons")

if __name__ == "__main__":
    create_random_lukons()
    conn.close()