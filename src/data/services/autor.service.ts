import axios from "axios"
import { URL_SERVIDOR_REST } from "../utils/configuracion"
import { Autor, validar } from "../domain/autor-domain"

class AutorService {
  async obtenerPorId(id: number) {
    return axios.get<Autor>(`${URL_SERVIDOR_REST}/autores/${id}`)
  }

  async obtenerTodos() {
    return axios.get<Autor[]>(`${URL_SERVIDOR_REST}/autores`)
  }

  async obtenerPorTexto(textoBusqueda: string) {
    return axios.get<Autor[]>(`${URL_SERVIDOR_REST}/autores/buscar`, {
      params: {
        buscar: textoBusqueda
      }
    })
  }

  async guardar(autorModificado: Autor) {
    validar(autorModificado)
    return axios.put<Autor>(`${URL_SERVIDOR_REST}/autores/${autorModificado.id}`, autorModificado)
  }

  async nuevo(nuevoAutor: Autor) {
    validar(nuevoAutor)
    return axios.post<Autor>(`${URL_SERVIDOR_REST}/administracion/agregar-autor`, nuevoAutor)
  }

  async eliminar(autorAEliminar: Autor) {
    return axios.delete<Autor>(`${URL_SERVIDOR_REST}/autores/${autorAEliminar.id}`)
  }
}

export const autoresService = new AutorService()