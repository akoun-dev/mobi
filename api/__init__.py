# Initialisation du package API
from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Import des routes
    from .api import init_routes
    init_routes(app)
    
    return app