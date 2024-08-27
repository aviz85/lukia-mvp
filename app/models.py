# app/models.py

import uuid
from .database import conn


class Lukon:

    @staticmethod
    def create(name, description, problem, solution, user_id, tags=None):
        lukon_id = str(uuid.uuid4())
        problem_id = str(uuid.uuid4())
        solution_id = str(uuid.uuid4())

        query = """
        CREATE (l:Lukon {id: $lukon_id, name: $name, description: $description, created_at: datetime()})
        CREATE (p:Problem {id: $problem_id, description: $problem_description})
        CREATE (s:Solution {id: $solution_id, description: $solution_description})
        MERGE (u:User {id: $user_id})
        CREATE (u)-[:CREATES]->(l)
        CREATE (l)-[:HAS]->(p)
        CREATE (l)-[:HAS]->(s)
        """

        if tags:
            query += """
            WITH l
            UNWIND $tags AS tag
            MERGE (t:Tag {name: tag})
            CREATE (l)-[:TAGGED_WITH]->(t)
            """

        query += "RETURN l"

        parameters = {
            'lukon_id': lukon_id,
            'name': name,
            'description': description,
            'problem_id': problem_id,
            'problem_description': problem,
            'solution_id': solution_id,
            'solution_description': solution,
            'user_id': user_id,
            'tags': tags or []
        }

        result = conn.query(query, parameters)
        return lukon_id

    @staticmethod
    def get(lukon_id):
        query = """
        MATCH (l:Lukon {id: $lukon_id})
        OPTIONAL MATCH (l)-[:HAS]->(p:Problem)
        OPTIONAL MATCH (l)-[:HAS]->(s:Solution)
        OPTIONAL MATCH (l)-[:TAGGED_WITH]->(t:Tag)
        RETURN l, collect(p) as problems, collect(s) as solutions, collect(t.name) as tags
        """

        result = conn.query(query, {'lukon_id': lukon_id})

        if not result:
            return None

        record = result[0]
        lukon_data = record['l']
        problems = [problem['description'] for problem in record['problems']]
        solutions = [
            solution['description'] for solution in record['solutions']
        ]
        tags = record['tags']

        return {
            "id": lukon_data['id'],
            "name": lukon_data['name'],
            "description": lukon_data['description'],
            "created_at": lukon_data['created_at'],
            "problems": problems,
            "solutions": solutions,
            "tags": tags
        }

    @staticmethod
    def update(lukon_id, name, description, problem, solution, tags=None):
        query = """
        MATCH (l:Lukon {id: $lukon_id})
        SET l.name = $name, l.description = $description
        WITH l
        OPTIONAL MATCH (l)-[:HAS]->(p:Problem)
        SET p.description = $problem_description
        WITH l
        OPTIONAL MATCH (l)-[:HAS]->(s:Solution)
        SET s.description = $solution_description
        WITH l
        OPTIONAL MATCH (l)-[r:TAGGED_WITH]->(t:Tag)
        DELETE r
        WITH l
        """

        if tags:
            query += """
            UNWIND $tags AS tag
            MERGE (t:Tag {name: tag})
            CREATE (l)-[:TAGGED_WITH]->(t)
            """

        query += "RETURN l"

        parameters = {
            'lukon_id': lukon_id,
            'name': name,
            'description': description,
            'problem_description': problem,
            'solution_description': solution,
            'tags': tags or []
        }

        result = conn.query(query, parameters)
        return len(result) > 0

    @staticmethod
    def delete(lukon_id):
        query = """
        MATCH (l:Lukon {id: $lukon_id})
        OPTIONAL MATCH (l)-[:HAS]->(p:Problem)
        OPTIONAL MATCH (l)-[:HAS]->(s:Solution)
        DETACH DELETE l, p, s
        """

        conn.query(query, {'lukon_id': lukon_id})
        return True

    @staticmethod
    def search(keyword='', tags=None):
        query = """
        MATCH (l:Lukon)
        WHERE (toLower(l.name) CONTAINS toLower($keyword) OR toLower(l.description) CONTAINS toLower($keyword))
        """
        
        if tags:
            query += """
            AND ALL(tag IN $tags WHERE (l)-[:TAGGED_WITH]->(:Tag {name: tag}))
            """
        
        query += """
        OPTIONAL MATCH (l)-[:TAGGED_WITH]->(t:Tag)
        RETURN l, collect(t.name) as tags
        ORDER BY l.created_at DESC
        LIMIT 10
        """
        
        parameters = {'keyword': keyword, 'tags': tags or []}
        results = conn.query(query, parameters)
        return [{
            "id": record['l']['id'],
            "name": record['l']['name'],
            "description": record['l']['description'],
            "tags": record['tags']
        } for record in results]

    @staticmethod
    def add_tag(lukon_id, tag):
        query = """
        MATCH (l:Lukon {id: $lukon_id})
        MERGE (t:Tag {name: $tag})
        MERGE (l)-[:TAGGED_WITH]->(t)
        RETURN l, t
        """
        parameters = {'lukon_id': lukon_id, 'tag': tag}
        result = conn.query(query, parameters)
        return len(result) > 0

    @staticmethod
    def remove_tag(lukon_id, tag):
        query = """
        MATCH (l:Lukon {id: $lukon_id})-[r:TAGGED_WITH]->(t:Tag {name: $tag})
        DELETE r
        RETURN l
        """
        parameters = {'lukon_id': lukon_id, 'tag': tag}
        result = conn.query(query, parameters)
        return len(result) > 0

    @staticmethod
    def mark_as_interesting(lukon_id, user_id):
        query = """
        MATCH (l:Lukon {id: $lukon_id})
        MATCH (u:User {id: $user_id})
        MERGE (u)-[:INTERESTED_IN]->(l)
        RETURN l, u
        """
        parameters = {'lukon_id': lukon_id, 'user_id': user_id}
        result = conn.query(query, parameters)
        return len(result) > 0

    @staticmethod
    def unmark_as_interesting(lukon_id, user_id):
        query = """
        MATCH (u:User {id: $user_id})-[r:INTERESTED_IN]->(l:Lukon {id: $lukon_id})
        DELETE r
        RETURN u, l
        """
        parameters = {'lukon_id': lukon_id, 'user_id': user_id}
        result = conn.query(query, parameters)
        return len(result) > 0

    @staticmethod
    def add_comment(lukon_id, user_id, comment_text):
        comment_id = str(uuid.uuid4())
        query = """
        MATCH (l:Lukon {id: $lukon_id})
        MATCH (u:User {id: $user_id})
        CREATE (c:Comment {id: $comment_id, text: $comment_text, created_at: datetime()})
        CREATE (u)-[:WROTE]->(c)
        CREATE (c)-[:ABOUT]->(l)
        RETURN c
        """
        parameters = {
            'lukon_id': lukon_id,
            'user_id': user_id,
            'comment_id': comment_id,
            'comment_text': comment_text
        }
        result = conn.query(query, parameters)
        return comment_id if len(result) > 0 else None

    @staticmethod
    def get_comments(lukon_id):
        query = """
        MATCH (l:Lukon {id: $lukon_id})<-[:ABOUT]-(c:Comment)<-[:WROTE]-(u:User)
        RETURN c, u
        ORDER BY c.created_at DESC
        """
        parameters = {'lukon_id': lukon_id}
        results = conn.query(query, parameters)
        return [{
            "id": record['c']['id'],
            "text": record['c']['text'],
            "created_at": record['c']['created_at'],
            "user_id": record['u']['id']
        } for record in results]

    @staticmethod
    def suggest_problem(lukon_id, user_id, problem_description):
        problem_id = str(uuid.uuid4())
        query = """
        MATCH (l:Lukon {id: $lukon_id})
        MATCH (u:User {id: $user_id})
        CREATE (p:SuggestedProblem {id: $problem_id, description: $problem_description, created_at: datetime()})
        CREATE (u)-[:SUGGESTED]->(p)
        CREATE (p)-[:FOR]->(l)
        RETURN p
        """
        parameters = {
            'lukon_id': lukon_id,
            'user_id': user_id,
            'problem_id': problem_id,
            'problem_description': problem_description
        }
        result = conn.query(query, parameters)
        return problem_id if len(result) > 0 else None

    @staticmethod
    def suggest_solution(lukon_id, user_id, solution_description):
        solution_id = str(uuid.uuid4())
        query = """
        MATCH (l:Lukon {id: $lukon_id})
        MATCH (u:User {id: $user_id})
        CREATE (s:SuggestedSolution {id: $solution_id, description: $solution_description, created_at: datetime()})
        CREATE (u)-[:SUGGESTED]->(s)
        CREATE (s)-[:FOR]->(l)
        RETURN s
        """
        parameters = {
            'lukon_id': lukon_id,
            'user_id': user_id,
            'solution_id': solution_id,
            'solution_description': solution_description
        }
        result = conn.query(query, parameters)
        return solution_id if len(result) > 0 else None

    @staticmethod
    def get_statistics(lukon_id):
        query = """
        MATCH (l:Lukon {id: $lukon_id})
        OPTIONAL MATCH (u:User)-[:INTERESTED_IN]->(l)
        OPTIONAL MATCH (c:Comment)-[:ABOUT]->(l)
        OPTIONAL MATCH (sp:SuggestedProblem)-[:FOR]->(l)
        OPTIONAL MATCH (ss:SuggestedSolution)-[:FOR]->(l)
        RETURN l,
               COUNT(DISTINCT u) AS interested_users,
               COUNT(DISTINCT c) AS comments,
               COUNT(DISTINCT sp) AS suggested_problems,
               COUNT(DISTINCT ss) AS suggested_solutions
        """
        parameters = {'lukon_id': lukon_id}
        result = conn.query(query, parameters)
        if not result:
            return None
        record = result[0]
        return {
            "interested_users": record['interested_users'],
            "comments": record['comments'],
            "suggested_problems": record['suggested_problems'],
            "suggested_solutions": record['suggested_solutions']
        }

    @staticmethod
    def get_all_tags():
        query = """
        MATCH (t:Tag)
        RETURN t.name AS tag
        ORDER BY t.name
        """
        results = conn.query(query)
        return [record['tag'] for record in results]


class User:

    @staticmethod
    def create(name, email):
        user_id = str(uuid.uuid4())
        query = """
        CREATE (u:User {id: $user_id, name: $name, email: $email, created_at: datetime()})
        RETURN u
        """
        parameters = {'user_id': user_id, 'name': name, 'email': email}
        result = conn.query(query, parameters)
        return user_id if len(result) > 0 else None

    @staticmethod
    def get(user_id):
        query = """
        MATCH (u:User {id: $user_id})
        RETURN u
        """
        parameters = {'user_id': user_id}
        result = conn.query(query, parameters)
        if not result:
            return None
        user_data = result[0]['u']
        return {
            "id": user_data['id'],
            "name": user_data['name'],
            "email": user_data['email'],
            "created_at": user_data['created_at']
        }

    @staticmethod
    def update(user_id, name, email):
        query = """
        MATCH (u:User {id: $user_id})
        SET u.name = $name, u.email = $email
        RETURN u
        """
        parameters = {'user_id': user_id, 'name': name, 'email': email}
        result = conn.query(query, parameters)
        return len(result) > 0

    @staticmethod
    def delete(user_id):
        query = """
        MATCH (u:User {id: $user_id})
        DETACH DELETE u
        """
        conn.query(query, {'user_id': user_id})
        return True
