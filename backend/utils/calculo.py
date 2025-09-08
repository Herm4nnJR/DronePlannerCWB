from backend.DAO.droneDAO import DroneDAO


def CalculaTempo(distancia_metros, drone):
    """
    Calcula o tempo de voo em horas, dado a distância (em metros) e velocidade (em km/h).
    Retorna None se dados inválidos.
    """
    try:
        distancia_km = float(distancia_metros) / 1000
        velocidade_drone_kmh = float(DroneDAO().get_velocidade_by_modelo_id(drone))
        if velocidade_drone_kmh > 0:
            retorno = (distancia_km / velocidade_drone_kmh)
            return retorno
    except Exception:
        pass
    return None

def ConverteTempoParaHoraMinSeg(tempo_horas):
    try:
        horas = int(tempo_horas)
        minutos = int((tempo_horas - horas) * 60)
        segundos = int(((tempo_horas - horas) * 60 - minutos) * 60)
        if (horas > 0):
            return f"{horas} hora {minutos} minutos {segundos} segundos"
        if (minutos > 0):
            return f"{minutos} minutos {segundos} segundos"
        return f"{segundos} segundos"
    except Exception:
        pass
    return None