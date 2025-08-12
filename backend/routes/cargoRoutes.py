from flask import Blueprint, jsonify
from flask_cors import cross_origin

cargos_bp = Blueprint('cargos', __name__)

@cargos_bp.route('/api/cargos', methods=['GET'])
@cross_origin()
def get_cargos():
    cargos = [
        {"id": 1, "nome": "Medicamentos"},
        {"id": 2, "nome": "Equipamentos"},
        {"id": 3, "nome": "Sangue"}
    ]
    return jsonify(cargos)