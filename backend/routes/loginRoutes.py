from flask import Blueprint, request, jsonify
from flask_cors import cross_origin

login_bp = Blueprint('login', __name__)

@login_bp.route('/api/login', methods=['POST'])
@cross_origin()
def login():
    data = request.get_json()
    login = data.get('login')
    password = data.get('password')
    if login == 'admin' and password == 'admin':
        return jsonify({'success': True})
    return jsonify({'success': False})