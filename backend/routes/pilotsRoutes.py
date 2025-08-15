from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from backend.DAO.pilotoDAO import PilotoDAO
from backend.utils.jsonfyObjects import jsonify_list_of_objects

pilots_bp = Blueprint('pilots', __name__)
piloto_dao = PilotoDAO()

@pilots_bp.route('/api/pilots', methods=['GET'])
@cross_origin()
@jsonify_list_of_objects
def get_pilots():
    return piloto_dao.get_all_pilotos()