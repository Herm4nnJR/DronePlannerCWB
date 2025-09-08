from backend.Entities.droneEntity import Drone
from backend.Entities.droneModeloEntity import DroneModelo
from backend.utils.db import get_connection


class DroneDAO:
    def get_all_modelos(self):
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT id, modelo, fabricante, velocidade_horizontal_max_kmh * 0.75, distancia_max_voo_com_carga_km FROM tcc_hermann_modelo_drone WHERE velocidade_horizontal_max_kmh IS NOT NULL AND distancia_max_voo_com_carga_km IS NOT NULL")
                modelos = [DroneModelo(id, modelo, fabricante, velocidade, distancia_com_carga) for id, modelo, fabricante, velocidade, distancia_com_carga in cur.fetchall()]
                return modelos

    def get_all_drones(self):
        modelos = {m.id: m for m in self.get_all_modelos()}
        drones = []
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT numero_serie, id_modelo, ativo, lat, lng FROM tcc_hermann_drone_cadastrado")
                for numero_serie, id_modelo, ativo, lat, lng in cur.fetchall():
                    if id_modelo in modelos:
                        drones.append(Drone(numero_serie, modelos[id_modelo], ativo, lat, lng))
        return drones

    def get_velocidade_by_drone_id(self, drone_id):
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT velocidade_horizontal_max_kmh * 0.75 FROM tcc_hermann_modelo_drone WHERE id = %s", (drone_id,))
                resultado = cur.fetchone()
                return resultado[0] if resultado else None