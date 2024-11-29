import { URL_SERVIDOR_REST } from "@/data/utils/configuracion"
import axios from "axios"

export type Idioma = string

class LenguajeService {

    async obtenerLenguajes() {
        return axios.get<Idioma[]>(`${URL_SERVIDOR_REST}/lenguajes`)
    }    
  }
  
  export const lenguajeService = new LenguajeService()