import axios from 'axios'
import { URL_SERVIDOR_REST } from '../utils/configuracion'
import { EstadisticaDTO, InactivosDTO } from '../domain/estadisticas.domain';

class DashboardService {

  async obtenerEstadisticas() {
    return axios.get<EstadisticaDTO[]>(`${URL_SERVIDOR_REST}/administracion/estadisticas`)
  }

  async borrarUsuariosInactivos() {
    return axios.delete<InactivosDTO>(`${URL_SERVIDOR_REST}/administracion/usuarios-inactivos`)
  }

  async borrarCentrosInactivos() {
    return axios.delete<InactivosDTO>(`${URL_SERVIDOR_REST}/administracion/centros-inactivos`)
  }

}

export const dashboardService = new DashboardService()