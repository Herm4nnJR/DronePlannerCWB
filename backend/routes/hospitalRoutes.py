from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from backend.DAO.hospitalDAO import HospitalDAO
from backend.utils.jsonfyObjects import jsonify_list_of_objects

hospitalRoute = Blueprint('hospital', __name__)
hospitalDAO = HospitalDAO()

@hospitalRoute.route('/api/hospitais', methods=['GET'])
@cross_origin()
@jsonify_list_of_objects
def get_hospitais():
    return hospitalDAO.get_all_hospitais()

@hospitalRoute.route('/api/hospitais-origem', methods=['GET'])
@cross_origin()
@jsonify_list_of_objects
def get_hospitais_origem():
    crm_hospital_destino = request.args.get('hospitaldestino')
    carga = request.args.get('carga')
    return hospitalDAO.get_hospitais_without_destino(crm_hospital_destino, carga)