from flask import Blueprint, request, jsonify
from flask_cors import cross_origin

occurrence_bp = Blueprint('occurrence', __name__)

@occurrence_bp.route('/api/register', methods=['POST'])
@cross_origin()
def register():
    data = request.get_json()
    cargo = data.get('cargo')
    hospital_destino = data.get('hospitaldestino')
    hospital_origem = data.get('hospitalorigem')
    piloto = data.get('piloto')
    # Aqui você pode adicionar lógica para salvar no banco de dados futuramente
    if cargo and hospital_destino and hospital_origem and piloto:
        return jsonify({'success': True})
    return jsonify({'success': False, 'error': 'Dados incompletos'})