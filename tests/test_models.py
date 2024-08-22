import pytest
import sys
import os

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models import Lukon, User
from app.db_connection import conn
import uuid


# Dummy data tests
def test_lukon_create_dummy():
    lukon_id = str(uuid.uuid4())
    lukon = {
        'id': lukon_id,
        'name': 'Test Lukon',
        'description': 'This is a test Lukon',
        'problem': 'Test problem',
        'solution': 'Test solution',
    }
    assert isinstance(lukon['id'], str)
    assert len(lukon['id']) == 36  # UUID length


def test_user_create_dummy():
    user_id = str(uuid.uuid4())
    user = {
        'id': user_id,
        'name': 'Test User',
        'email': 'test@example.com',
    }
    assert isinstance(user['id'], str)
    assert len(user['id']) == 36  # UUID length


# Real database tests
@pytest.fixture(autouse=True, scope="function")
def setup_database():
    # This fixture will run automatically before each test function
    conn.query("MATCH (n) DETACH DELETE n")
    yield
    # Clean up after each test function
    conn.query("MATCH (n) DETACH DELETE n")


@pytest.fixture(autouse=True, scope="session")
def close_db_connection():
    # This fixture will run once at the end of the test session
    yield
    conn.close()


def test_lukon_create_real(setup_database):
    user_id = User.create('Test User', 'test@example.com')
    assert user_id is not None

    lukon_id = Lukon.create('Test Lukon', 'This is a test Lukon',
                            'Test problem', 'Test solution', user_id)
    assert lukon_id is not None

    lukon = Lukon.get(lukon_id)
    assert lukon is not None
    assert lukon['name'] == 'Test Lukon'
    assert lukon['description'] == 'This is a test Lukon'
    assert 'Test problem' in lukon['problems']
    assert 'Test solution' in lukon['solutions']


def test_lukon_update_real(setup_database):
    user_id = User.create('Test User', 'test@example.com')
    lukon_id = Lukon.create('Test Lukon', 'This is a test Lukon',
                            'Test problem', 'Test solution', user_id)

    updated = Lukon.update(lukon_id, 'Updated Lukon', 'Updated description',
                           'Updated problem', 'Updated solution')
    assert updated is True

    lukon = Lukon.get(lukon_id)
    assert lukon['name'] == 'Updated Lukon'
    assert lukon['description'] == 'Updated description'
    assert 'Updated problem' in lukon['problems']
    assert 'Updated solution' in lukon['solutions']


def test_lukon_delete_real(setup_database):
    user_id = User.create('Test User', 'test@example.com')
    lukon_id = Lukon.create('Test Lukon', 'This is a test Lukon',
                            'Test problem', 'Test solution', user_id)

    deleted = Lukon.delete(lukon_id)
    assert deleted is True

    lukon = Lukon.get(lukon_id)
    assert lukon is None


def test_lukon_search_real():
    user_id = User.create('Test User', 'test@example.com')

    # Create test Lukons
    lukon1_id = Lukon.create('Test Lukon 1', 'This is a test Lukon',
                             'Test problem', 'Test solution', user_id)
    lukon2_id = Lukon.create('Test Lukon 2', 'This is another test Lukon',
                             'Another problem', 'Another solution', user_id)
    lukon3_id = Lukon.create('Unrelated Lukon',
                             'This should not appear in results',
                             'Unrelated problem', 'Unrelated solution',
                             user_id)

    # Verify creation
    assert Lukon.get(lukon1_id) is not None
    assert Lukon.get(lukon2_id) is not None
    assert Lukon.get(lukon3_id) is not None

    # Test search
    results = Lukon.search('test')
    assert len(
        results) == 2, f"Expected 2 results, got {len(results)}: {results}"
    assert all('Test Lukon' in result['name'] for result in results)

    results = Lukon.search('another')
    assert len(
        results) == 1, f"Expected 1 result, got {len(results)}: {results}"
    assert results[0]['name'] == 'Test Lukon 2'

    results = Lukon.search('unrelated')
    assert len(
        results) == 1, f"Expected 1 result, got {len(results)}: {results}"
    assert results[0]['name'] == 'Unrelated Lukon'

    # Verify database is clean after the test
    all_lukons = conn.query("MATCH (l:Lukon) RETURN l")
    assert len(
        all_lukons
    ) == 3, f"Expected 3 Lukons, found {len(all_lukons)}: {all_lukons}"


def test_lukon_add_tag_real(setup_database):
    user_id = User.create('Test User', 'test@example.com')
    lukon_id = Lukon.create('Test Lukon', 'This is a test Lukon',
                            'Test problem', 'Test solution', user_id)

    tagged = Lukon.add_tag(lukon_id, 'TestTag')
    assert tagged is True


def test_lukon_mark_as_interesting_real(setup_database):
    user_id = User.create('Test User', 'test@example.com')
    lukon_id = Lukon.create('Test Lukon', 'This is a test Lukon',
                            'Test problem', 'Test solution', user_id)

    marked = Lukon.mark_as_interesting(lukon_id, user_id)
    assert marked is True


def test_lukon_add_comment_real(setup_database):
    user_id = User.create('Test User', 'test@example.com')
    lukon_id = Lukon.create('Test Lukon', 'This is a test Lukon',
                            'Test problem', 'Test solution', user_id)

    comment_id = Lukon.add_comment(lukon_id, user_id, 'This is a test comment')
    assert comment_id is not None

    comments = Lukon.get_comments(lukon_id)
    assert len(comments) == 1
    assert comments[0]['text'] == 'This is a test comment'


def test_lukon_suggest_problem_and_solution_real(setup_database):
    user_id = User.create('Test User', 'test@example.com')
    lukon_id = Lukon.create('Test Lukon', 'This is a test Lukon',
                            'Test problem', 'Test solution', user_id)

    problem_id = Lukon.suggest_problem(lukon_id, user_id, 'Suggested problem')
    assert problem_id is not None

    solution_id = Lukon.suggest_solution(lukon_id, user_id,
                                         'Suggested solution')
    assert solution_id is not None


def test_lukon_get_statistics_real(setup_database):
    user_id = User.create('Test User', 'test@example.com')
    lukon_id = Lukon.create('Test Lukon', 'This is a test Lukon',
                            'Test problem', 'Test solution', user_id)

    Lukon.mark_as_interesting(lukon_id, user_id)
    Lukon.add_comment(lukon_id, user_id, 'Test comment')
    Lukon.suggest_problem(lukon_id, user_id, 'Suggested problem')
    Lukon.suggest_solution(lukon_id, user_id, 'Suggested solution')

    stats = Lukon.get_statistics(lukon_id)
    assert stats['interested_users'] == 1
    assert stats['comments'] == 1
    assert stats['suggested_problems'] == 1
    assert stats['suggested_solutions'] == 1


def test_user_crud_real(setup_database):
    user_id = User.create('Test User', 'test@example.com')
    assert user_id is not None

    user = User.get(user_id)
    assert user is not None
    assert user['name'] == 'Test User'
    assert user['email'] == 'test@example.com'

    updated = User.update(user_id, 'Updated User', 'updated@example.com')
    assert updated is True

    user = User.get(user_id)
    assert user['name'] == 'Updated User'
    assert user['email'] == 'updated@example.com'

    deleted = User.delete(user_id)
    assert deleted is True

    user = User.get(user_id)
    assert user is None
