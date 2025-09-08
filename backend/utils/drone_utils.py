from backend.DAO.droneDAO import DroneDAO


def CalculaTempo(distancia_metros, drone):
    """
    Calcula o tempo de voo em horas, dado a distância (em metros) e velocidade (em km/h).
    Retorna None se dados inválidos.
    """
    try:
        distancia_km = float(distancia_metros) / 1000
        velocidade_drone_kmh = DroneDAO().get_velocidade_by_drone_id(drone)
        if velocidade_drone_kmh > 0:
            return (distancia_km / velocidade_drone_kmh) / 60
    except Exception:
        pass
    return None
