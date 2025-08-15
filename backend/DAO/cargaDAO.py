from backend.Entities.cargaEntity import Carga
from backend.utils.db import get_connection

class CargaDAO:
    def get_all_cargas(self):
        cargas = []
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT id, descricao FROM tcc_hermann_carga")
                cargas = [Carga(id, descricao) for id, descricao in cur.fetchall()]
        return cargas