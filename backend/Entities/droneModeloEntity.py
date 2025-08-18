class DroneModelo:
    def __init__(self, id, modelo, fabricante):
        self.id = id
        self.modelo = modelo
        self.fabricante = fabricante
        
    def to_dict(self):
        return {
            "id": self.id,
            "modelo": self.modelo,
            "fabricante": self.fabricante
        }