from backend.Entities.droneEntity import Drone
from backend.Entities.droneModeloEntity import DroneModelo
from backend.utils.db import get_connection


class DroneDAO:
    def get_all_modelos(self):
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT id, modelo, fabricante FROM tcc_hermann_modelo_drone")
                modelos = [DroneModelo(id, modelo, fabricante) for id, modelo, fabricante in cur.fetchall()]
                return modelos

    def get_all_drones(self):
        modelos = {m.id: m for m in self.get_all_modelos()}
        drones = []
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT numero_serie, id_modelo, ativo, lat, lng FROM tcc_hermann_drone_cadastrado")
                drones = [Drone(numero_serie, modelos.get(id_modelo), ativo, lat, lng) for numero_serie, id_modelo, ativo, lat, lng in cur.fetchall()]
        return drones