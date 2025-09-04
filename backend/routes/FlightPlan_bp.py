from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from backend.Entities.flightPlanEntity import FlightPlan
from backend.DAO.flightPlanDAO import FlightPlanDAO

flightplan_bp = Blueprint('flightplan', __name__)

@flightplan_bp.route('/api/register', methods=['POST'])
@cross_origin()
def register():
    try:
        data = request.get_json()
        flight_plan_entity = FlightPlan.from_dict(data)

        flight_plan_dao = FlightPlanDAO()
        plano_voo_id = flight_plan_dao.create_flight_plan(flight_plan_entity)

        if plano_voo_id:
            return jsonify({'success': True, 'plano_voo_id': plano_voo_id})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})
    return jsonify({'success': False, 'error': 'Dados incompletos'})