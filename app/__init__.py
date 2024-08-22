# app/__init__.py

from flask import Flask
from flask_cors import CORS
from .db_connection import conn
from .routes import lukon_routes


def create_app():
    app = Flask(__name__)
    CORS(app)

    # Register blueprints
    app.register_blueprint(lukon_routes.bp)

    return app


# Make sure to export the create_app function
__all__ = ['create_app']
