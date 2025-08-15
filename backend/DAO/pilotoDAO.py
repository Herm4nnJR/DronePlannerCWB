from backend.Entities.pilotoEntity import Piloto
from backend.utils.db import get_connection

class PilotoDAO:
    def get_all_pilotos(self):
        pilotos = []
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT cod_sarpas, nome FROM tcc_hermann_piloto")
                pilotos = [Piloto(cod_sarpas, nome) for cod_sarpas, nome in cur.fetchall()]
        return pilotos