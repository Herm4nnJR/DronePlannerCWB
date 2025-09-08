class DroneModelo:
    def __init__(self, id, modelo, fabricante, velocidade, distanciaComCarga):
        self.id = id
        self.modelo = modelo
        self.fabricante = fabricante
        self.velocidade = velocidade
        self.distanciaComCarga = distanciaComCarga

    def to_dict(self):
        return {
            "id": self.id,
            "modelo": self.modelo,
            "fabricante": self.fabricante,
            "velocidade": self.velocidade,
            "distanciaComCarga": self.distanciaComCarga
        }