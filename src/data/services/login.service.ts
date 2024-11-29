import axios from "axios"
import { URL_SERVIDOR_REST } from "../utils/configuracion"
import { Administrador } from "../domain/Administrador.domain"


class LoginService {
    
    async autenticarUsuarioLogueado(usuario : Administrador) {
        return axios.post(`${URL_SERVIDOR_REST}/autenticacion`,usuario)
    }
        
}

export const loginService = new LoginService()