from flask import jsonify
from .models import Lukon

# ... other imports and existing routes ...

@app.route('/api/universe', methods=['GET'])
def get_universe_data():
    universe_data = Lukon.get_universe_data()
    return jsonify(universe_data)