import axios from "axios"
import { URL_SERVIDOR_REST } from "../utils/configuracion"
import { Libro, LibroDTO } from "@/data/domain/libro-domain"

class LibroService {

    async obtenerTodosLibros() {
        return axios.get<LibroDTO[]>(`${URL_SERVIDOR_REST}/libros`)
    }

    async obtenerPorTexto(textoBusqueda: string) {
        return axios.get<Libro[]>(`${URL_SERVIDOR_REST}/libros/buscar`, {
            params: {
                buscar: textoBusqueda
            }
        })
    }

    async obtenerLibroPorId(id: number) {
        return axios.get<LibroDTO>(`${URL_SERVIDOR_REST}/libros/${id}`)
    }

    async actualizarLibro(libro: Libro) {
        const libroDTO = Libro.toDTO(libro)
        return axios.put<LibroDTO>(`${URL_SERVIDOR_REST}/libros`, libroDTO)
    }

    async eliminarLibro(libro: Libro) {
        return axios.delete(`${URL_SERVIDOR_REST}/libros/${libro.id}`)
    }

    async agregarLibro(libro: Libro) {
        const libroDTO = Libro.toDTO(libro)
        return axios.post<LibroDTO>(`${URL_SERVIDOR_REST}/libros`, libroDTO)
    }
    
  }
  
  export const libroService = new LibroService()