# Neo4j Database Specification for Lukon System

## 1. Node Types

### 1.1 Lukon
- Properties:
  - id: UUID (primary key)
  - name: String
  - description: String
  - created_at: DateTime
  - is_deleted: Boolean (optional)
  - deleted_at: DateTime (optional)

### 1.2 Problem
- Properties:
  - id: UUID (primary key)
  - description: String
  - is_deleted: Boolean (optional)

### 1.3 Solution
- Properties:
  - id: UUID (primary key)
  - description: String
  - is_deleted: Boolean (optional)

### 1.4 User
- Properties:
  - id: UUID (primary key)
  - name: String
  - email: String
  - created_at: DateTime

### 1.5 Tag
- Properties:
  - name: String (primary key)

### 1.6 Comment
- Properties:
  - id: UUID (primary key)
  - text: String
  - created_at: DateTime

### 1.7 SuggestedProblem
- Properties:
  - id: UUID (primary key)
  - description: String
  - created_at: DateTime

### 1.8 SuggestedSolution
- Properties:
  - id: UUID (primary key)
  - description: String
  - created_at: DateTime

## 2. Relationships

### 2.1 User to Lukon
- CREATES: User -[:CREATES]-> Lukon
- INTERESTED_IN: User -[:INTERESTED_IN]-> Lukon

### 2.2 Lukon to Problem/Solution
- HAS: Lukon -[:HAS]-> Problem
- HAS: Lukon -[:HAS]-> Solution

### 2.3 Lukon to Tag
- TAGGED_WITH: Lukon -[:TAGGED_WITH]-> Tag

### 2.4 User to Comment
- WROTE: User -[:WROTE]-> Comment

### 2.5 Comment to Lukon
- ABOUT: Comment -[:ABOUT]-> Lukon

### 2.6 User to SuggestedProblem/SuggestedSolution
- SUGGESTED: User -[:SUGGESTED]-> SuggestedProblem
- SUGGESTED: User -[:SUGGESTED]-> SuggestedSolution

### 2.7 SuggestedProblem/SuggestedSolution to Lukon
- FOR: SuggestedProblem -[:FOR]-> Lukon
- FOR: SuggestedSolution -[:FOR]-> Lukon

## 3. Indexes and Constraints

- Unique constraint on Lukon.id
- Unique constraint on User.id
- Unique constraint on Problem.id
- Unique constraint on Solution.id
- Unique constraint on Comment.id
- Unique constraint on SuggestedProblem.id
- Unique constraint on SuggestedSolution.id
- Unique constraint on Tag.name

## 4. Notes

- Soft delete is implemented for Lukon, Problem, and Solution nodes using the is_deleted property.
- The system uses UUIDs for most entity IDs to ensure uniqueness across the database.
- Tags are implemented as separate nodes to allow for efficient querying and relationship management.
- The database structure allows for multiple problems and solutions per Lukon, as well as user interactions such as comments, suggestions, and interest marking.