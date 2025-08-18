from flask import Blueprint
from flask_cors import cross_origin
from backend.DAO.droneDAO import DroneDAO
from backend.utils.jsonfyObjects import jsonify_list_of_objects

drone_bp = Blueprint('drones', __name__)
droneDAO = DroneDAO()

@drone_bp.route('/api/drones', methods=['GET'])
@cross_origin()
@jsonify_list_of_objects
def get_drones():
    drone = droneDAO.get_all_drones()
    return drone