from flask import Blueprint, request, jsonify
import requests

map_bp = Blueprint('map_bp', __name__)

GRAPHHOPPER_API_KEY = '2083ac38-5abf-4aa1-86e6-1f65dd2e2aaa'

@map_bp.route('/api/map_route', methods=['GET'])
def get_route():
    points = request.args.getlist('point')

    if not points or len(points) < 2:
        return jsonify({"error": "Pelo menos dois pontos são obrigatórios"}), 400
    
    point_params = "&".join([f"point={p}" for p in points])   
    
    url = (
        f"https://graphhopper.com/api/1/route?"
        f"{point_params}&"
        f"vehicle=foot&"
        f"key={GRAPHHOPPER_API_KEY}&"
        f"points_encoded=true&"
        f"details=distance"
    )

    try:
        response = requests.get(url)
        response.raise_for_status()  
        response_data = response.json()

        route = response_data.get('paths', [{}])[0].get('points', [])
        distance = response_data.get('paths', [{}])[0].get('distance', [])

        return jsonify({"route": route, "distancia": distance})

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Erro ao contatar a API de rotas: {e}"}), 500
