from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# Add your API routes here
# For example:
@app.route('/api/example', methods=['GET'])
def example_route():
    return jsonify({"message": "This is an example API route"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)