from flask import Blueprint, request, jsonify
import requests
from backend.utils.calculo import CalculaTempo, ConverteTempoParaHoraMinSeg

map_bp = Blueprint('map_bp', __name__)

GRAPHHOPPER_API_KEY = '2083ac38-5abf-4aa1-86e6-1f65dd2e2aaa'

@map_bp.route('/api/map_route', methods=['GET'])
def get_route():
    points = request.args.getlist('point')
    drone_utilizado = request.args.get('droneUtilizado')

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
        
        time = None
        if drone_utilizado:
            time = CalculaTempo(distance, drone_utilizado)
            tempo_hora_min_seg = ConverteTempoParaHoraMinSeg(time)

        distance_km = round(distance / 1000, 3)
                
        return jsonify({
            "route": route,
            "distancia": distance_km,
            "tempo": time,
            "tempo_hora_min_seg": tempo_hora_min_seg
        })
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Erro ao contatar a API de rotas: {e}"}), 500

@map_bp.route('/api/tempo_distancia_total', methods=['GET'])
def get_tempo_distancia_total():
    tempo1 = request.args.get('tempo1')
    tempo2 = request.args.get('tempo2')
    distancia1 = request.args.get('distancia1')
    distancia2 = request.args.get('distancia2')

    try:
        tempo_total = float(tempo1) + float(tempo2)
        tempo_hora_min_seg = ConverteTempoParaHoraMinSeg(tempo_total)
        return jsonify({
            "tempo": tempo_total,
            "tempo_hora_min_seg": tempo_hora_min_seg,
            "distancia": distancia1 + distancia2
        })
    except ValueError:
        return jsonify({"error": "Tempos inválidos"}), 400