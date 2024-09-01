from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder='static')

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
# @app.route('/api/example', methods=['GET'])
# def example_route():
#     return {"message": "This is an example API route"}

if __name__ == '__main__':
    app.run(use_reloader=True, port=5000, threaded=True)