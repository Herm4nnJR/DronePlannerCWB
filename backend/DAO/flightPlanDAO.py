from backend.Entities.flightPlanEntity import FlightPlan
from backend.utils.enums import StatusPlanoVoo
from backend.utils.db import get_connection

class FlightPlanDAO:
    def __init__(self):
        self.connection = get_connection()

    def create_flight_plan(self, flight_plan: FlightPlan):
        cursor = self.connection.cursor()
        try:
            cursor.execute("""
                INSERT INTO tcc_hermann_plano_voo (nome_operacao, perfil_operacao, inicio_operacao, hospital_origem, hospital_destino, status, observacoes)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                flight_plan.nome_operacao, 
                flight_plan.perfil_operacao, 
                flight_plan.inicio_operacao, 
                flight_plan.hospital_origem_crm, 
                flight_plan.hospital_destino_crm, 
                flight_plan.status,
                flight_plan.observacoes
            ))

            plano_voo_id = cursor.fetchone()[0]
            
            cursor.execute("""
                INSERT INTO tcc_hermann_plano_voo_piloto (id_plano_voo, cod_sarpas)
                VALUES (%s, %s)
            """, (plano_voo_id, flight_plan.piloto_sarpas))

            cursor.execute("""
                INSERT INTO tcc_hermann_plano_voo_drone (id_plano_voo, numero_serie, id_caixa_transporte)
                VALUES (%s, %s, %s)
            """, (plano_voo_id, flight_plan.drone_id, 1))

            cursor.execute("""
                INSERT INTO tcc_hermann_caixa_carga (id_caixa_transporte, id_carga, quantidade)
                VALUES (%s, %s, %s)
            """, (1, flight_plan.cargo_id, 1))

            self.connection.commit()
            print(f"Plano de voo {plano_voo_id} criado com sucesso.")
            return plano_voo_id

        except Exception as e:
            self.connection.rollback()
            print(f"Erro ao criar plano de voo: {e}")
            return None
        finally:
            cursor.close()