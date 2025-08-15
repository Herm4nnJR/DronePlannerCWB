class Piloto:
    def __init__(self, sarpas, nome):
        self.sarpas = sarpas
        self.nome = nome

    def to_dict(self):
        return {
            "sarpas": self.sarpas,
            "nome": self.nome
        }
        