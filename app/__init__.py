# app/__init__.py

import os
from flask import Flask
from flask_cors import CORS
from .db_connection import conn
from .routes import lukon_routes


def create_app(environ=None, start_response=None):
    app = Flask(__name__, template_folder='templates')
    
    # Get the frontend URL from environment variable, default to localhost if not set
    frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
    
    # Configure CORS
    CORS(app, resources={r"/*": {"origins": frontend_url}})

    # Register blueprints
    app.register_blueprint(lukon_routes.bp)

    return app


# Make sure to export the create_app function
__all__ = ['create_app']