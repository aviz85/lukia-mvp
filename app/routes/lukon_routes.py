# app/routes/lukon_routes.py
from flask import Blueprint, request, jsonify, render_template_string
from flask_swagger_ui import get_swaggerui_blueprint
from ..models import Lukon
import json
from flask import current_app

bp = Blueprint('lukon', __name__)

# Existing routes
@bp.route('/', methods=['GET'])
def welcome():
    return render_template('welcome.html')

@bp.route('/create', methods=['POST'])
def create_lukon():
    data = request.json
    lukon_id = Lukon.create(data['name'], data['description'], data['problem'],
                            data['solution'], data['user_id'], data.get('tags'))
    return jsonify({
        "message": "Lukon created successfully",
        "lukon_id": lukon_id
    }), 201

@bp.route('/<lukon_id>', methods=['GET'])
def get_lukon(lukon_id):
    lukon = Lukon.get(lukon_id)
    if not lukon:
        return jsonify({"error": "Lukon not found"}), 404
    return jsonify(lukon)

@bp.route('/<lukon_id>', methods=['PUT'])
def update_lukon(lukon_id):
    data = request.json
    success = Lukon.update(lukon_id, data['name'], data['description'],
                           data['problem'], data['solution'])
    if not success:
        return jsonify({"error": "Lukon not found"}), 404
    return jsonify({"message": "Lukon updated successfully"})

@bp.route('/<lukon_id>', methods=['DELETE'])
def delete_lukon(lukon_id):
    success = Lukon.delete(lukon_id)
    if not success:
        return jsonify({"error": "Lukon not found"}), 404
    return jsonify({"message": "Lukon deleted successfully"})

@bp.route('/search', methods=['GET'])
def search_lukons():
    try:
        keyword = request.args.get('keyword', '')
        tags = request.args.get('tags', '')
        tags_list = [tag.strip() for tag in tags.split(',')] if tags else []
        
        print(f"Searching with keyword: {keyword}, tags: {tags_list}")  # Debug log
        
        lukons = Lukon.search(keyword, tags_list)
        
        print(f"Search results: {lukons}")  # Debug log
        
        return jsonify(lukons)
    except Exception as e:
        current_app.logger.error(f"Error in search_lukons: {str(e)}")
        return jsonify({"error": "An internal error occurred"}), 500

# New routes for Swagger UI
@bp.route("/swagger.json")
def swagger():
    with open('app/swagger.json', 'r') as f:
        return jsonify(json.load(f))

@bp.route("/api-docs")
def api_docs():
    return render_template_string("""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Lukon API Documentation</title>
            <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@3/swagger-ui.css">
        </head>
        <body>
            <div id="swagger-ui"></div>
            <script src="https://unpkg.com/swagger-ui-dist@3/swagger-ui-bundle.js"></script>
            <script>
                const ui = SwaggerUIBundle({
                    url: "/swagger.json",
                    dom_id: '#swagger-ui',
                    presets: [
                        SwaggerUIBundle.presets.apis,
                        SwaggerUIBundle.SwaggerUIStandalonePreset
                    ],
                    layout: "BaseLayout"
                })
            </script>
        </body>
        </html>
    """)

# Swagger UI Blueprint
SWAGGER_URL = '/api/docs'
API_URL = '/swagger.json'

swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "Lukon API"
    }
)

# Function to register Swagger UI blueprint
def register_swagger_ui(app):
    app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

# New route for getting all tags
@bp.route('/tags', methods=['GET'])
def get_all_tags():
    tags = Lukon.get_all_tags()
    return jsonify(tags)