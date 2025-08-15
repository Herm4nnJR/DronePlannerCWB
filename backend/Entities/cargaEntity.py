class Carga:
    def __init__(self, id, descricao):
        self.id = id
        self.descricao = descricao
        
    def to_dict(self):
        return {
            "id": self.id,
            "descricao": self.descricao
        }
        