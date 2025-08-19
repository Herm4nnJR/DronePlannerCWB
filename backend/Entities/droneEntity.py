from backend.Entities.droneModeloEntity import DroneModelo

class Drone:
    def __init__(self, numeroSerie, modelo: DroneModelo, ativo, lat, lng):
        self.numeroSerie = numeroSerie
        self.modelo = modelo
        self.ativo = ativo
        self.lat = lat
        self.lng = lng

    def to_dict(self):
        return {
            "numeroSerie": self.numeroSerie,
            "modelo": self.modelo.to_dict(),
            "ativo": self.ativo,
            "lat": self.lat,
            "lng": self.lng
        }