from flask import Blueprint
from flask_cors import cross_origin
from backend.DAO.cargaDAO import CargaDAO
from backend.utils.jsonfyObjects import jsonify_list_of_objects

cargos_bp = Blueprint('cargos', __name__)
cargaDAO = CargaDAO()

@cargos_bp.route('/api/cargos', methods=['GET'])
@cross_origin()
@jsonify_list_of_objects
def get_cargos():
    return cargaDAO.get_all_cargas()