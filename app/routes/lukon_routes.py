# app/routes/lukon_routes.py
from flask import Blueprint, request, jsonify, render_template
from ..models import Lukon

bp = Blueprint('lukon', __name__)

@bp.route('/', methods=['GET'])
def welcome():
    return render_template('welcome.html')

@bp.route('/create', methods=['POST'])
def create_lukon():
    data = request.json
    lukon_id = Lukon.create(data['name'], data['description'], data['problem'],
                            data['solution'], data['user_id'])
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
    keyword = request.args.get('keyword', '')
    lukons = Lukon.search(keyword)
    return jsonify(lukons)