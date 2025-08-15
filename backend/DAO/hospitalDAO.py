from backend.Entities.hospitalEntity import Hospital
from backend.utils.db import get_connection

class HospitalDAO:
    def get_all_hospitais(self):
        hospitais = []
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT crm, nome, lat, lng FROM tcc_hermann_hospital")
                hospitais = [Hospital(crm, nome, lat, lng) for crm, nome, lat, lng in cur.fetchall()]
        return hospitais

    def get_hospitais_without_destino(self, crm_destino, carga):
        hospitais = []
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                            SELECT ho.crm, ho.nome, ho.lat, ho.lng
                            FROM tcc_hermann_hospital ho
                            INNER JOIN tcc_hermann_hospital_estoque est on (ho.crm = est.crm_hospital) 
                            WHERE ho.crm != %s
                            AND est.id_carga = %s
                            AND est.quantidade > 0
                            """, (crm_destino, carga))
                hospitais = [Hospital(crm, nome, lat, lng) for crm, nome, lat, lng in cur.fetchall()]
        return hospitais