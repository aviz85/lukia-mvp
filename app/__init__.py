# app/__init__.py

from flask import Flask
from flask_cors import CORS
from .db_connection import conn
from .routes import lukon_routes


def create_app():
    app = Flask(__name__, template_folder='templates')
    CORS(app)

    # Register blueprints
    app.register_blueprint(lukon_routes.bp)

    return app


# Make sure to export the create_app function
__all__ = ['create_app']

# Add this section to run the app
if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5001, debug=True)