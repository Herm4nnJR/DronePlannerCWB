from backend.Entities.droneModeloEntity import DroneModelo

class Drone:
    def __init__(self, numeroSerie, modelo: DroneModelo, ativo):
        self.numeroSerie = numeroSerie
        self.modelo = modelo
        self.ativo = ativo
        
    def to_dict(self):
        return {
            "numeroSerie": self.numeroSerie,
            "modelo": self.modelo.to_dict(),
            "ativo": self.ativo
        }