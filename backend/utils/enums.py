from enum import Enum

class StatusPlanoVoo(Enum):
    PLANEJADO = "1"
    EM_ANDAMENTO = "2"
    CONCLUIDO = "3"
    CANCELADO = "4"
    