class Hospital:
    def __init__(self, crm, nome, lat, lng):
        self.crm = crm
        self.nome = nome
        self.lat = lat
        self.lng = lng

    def to_dict(self):
        return {
            "crm": self.crm,
            "nome": self.nome,
            "lat": self.lat,
            "lng": self.lng
        }