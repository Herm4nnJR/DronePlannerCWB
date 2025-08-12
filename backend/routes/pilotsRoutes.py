from flask import Blueprint, jsonify, request
from flask_cors import cross_origin

pilots_bp = Blueprint('pilots', __name__)

@pilots_bp.route('/api/pilots', methods=['GET'])
@cross_origin()
def get_pilots():
    # Aqui você pode filtrar pilotos conforme parâmetros recebidos futuramente
    pilots = [
        {"id": 1, "nome": "João Silva"},
        {"id": 2, "nome": "Maria Souza"}
    ]
    return jsonify(pilots)