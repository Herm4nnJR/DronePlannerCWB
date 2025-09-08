from datetime import datetime
from backend.utils.enums import StatusPlanoVoo

class FlightPlan:
    def __init__(self, id, cargo_id, hospital_destino_crm, hospital_origem_crm, piloto_sarpas, drone_id, inicio_operacao, nome_operacao, perfil_operacao, observacoes, rota1=None, rota2=None, status=StatusPlanoVoo.PLANEJADO.value):
        self.id = id
        self.cargo_id = cargo_id
        self.hospital_destino_crm = hospital_destino_crm
        self.hospital_origem_crm = hospital_origem_crm
        self.piloto_sarpas = piloto_sarpas
        self.drone_id = drone_id
        self.inicio_operacao = inicio_operacao
        self.nome_operacao = nome_operacao
        self.perfil_operacao = perfil_operacao
        self.observacoes = observacoes
        self.rota1 = rota1
        self.rota2 = rota2
        self.status = status

    @staticmethod
    def from_dict(data):
        inicio_operacao_dt = None
        if data.get('inicioOperacao'):
            try:
                inicio_operacao_dt = datetime.fromisoformat(data['inicioOperacao'])
            except (ValueError, TypeError):
                inicio_operacao_dt = None

        return FlightPlan(
            id=None,
            cargo_id=data.get('cargo'),
            hospital_destino_crm=data.get('hospitaldestino'),
            hospital_origem_crm=data.get('hospitalorigem'),
            piloto_sarpas=data.get('piloto'),
            drone_id=data.get('drone'),
            inicio_operacao=inicio_operacao_dt,
            nome_operacao=data.get('nomeOperacao'),
            perfil_operacao=data.get('perfilOperacao'),
            observacoes=data.get('observacoes'),
            rota1=data.get('rota1'),
            rota2=data.get('rota2')
        )

    def to_dict(self):
        return {
            'id': self.id,
            'cargo_id': self.cargo_id,
            'hospital_destino_crm': self.hospital_destino_crm,
            'hospital_origem_crm': self.hospital_origem_crm,
            'piloto_sarpas': self.piloto_sarpas,
            'drone_id': self.drone_id,
            'inicio_operacao': self.inicio_operacao.isoformat() if self.inicio_operacao else None,
            'nome_operacao': self.nome_operacao,
            'perfil_operacao': self.perfil_operacao,
            'observacoes': self.observacoes,
            'rota1': self.rota1,
            'rota2': self.rota2,
            'status': self.status
        }