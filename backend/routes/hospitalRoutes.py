from flask import Blueprint, jsonify, request
from flask_cors import cross_origin

hospital_bp = Blueprint('hospital', __name__)

@hospital_bp.route('/api/hospitais', methods=['GET'])
@cross_origin()
def get_hospitais():
    hospitais = [
        {"id": 1, "nome": "Hospital Central", "lat": -25.4284, "lng": -49.2733},
        {"id": 2, "nome": "Hospital Regional", "lat": -25.4500, "lng": -49.2300}
    ]
    return jsonify(hospitais)

@hospital_bp.route('/api/hospitais-origem', methods=['GET'])
@cross_origin()
def get_hospitais_origem():
    hospital_destino = request.args.get('hospitaldestino')
    hospitais_origem = [
        {"id": 1, "nome": "Hospital Central", "lat": -25.4284, "lng": -49.2733},
        {"id": 2, "nome": "Hospital Regional", "lat": -25.4500, "lng": -49.2300}
    ]
    if hospital_destino:
        hospitais_origem = [h for h in hospitais_origem if str(h["id"]) != hospital_destino]
    return jsonify(hospitais_origem)