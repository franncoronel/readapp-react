import axios from "axios"
import MockAdapter from "axios-mock-adapter"
import { beforeEach, describe, expect, test } from "vitest"
import { loginService } from "@/data/services/login.service"
import { URL_SERVIDOR_REST } from "@/data/utils/configuracion"
import { Administrador } from "@/data/domain/Administrador.domain"

const mock = new MockAdapter(axios)

describe("LoginService", () => {
  const baseUrl = URL_SERVIDOR_REST

  beforeEach(() => {
    mock.reset()
  })

  describe("Si se usa autenticarUsuarioLogueado", () => {
    test("Autentica correctamente un administrador", async () => {
      const mockAdministrador: Administrador = {
        username: "admin",
        password: "undostrescuatrocinco",
        rol: ""
      }

      const mockRespuesta = {
        id: "78",
        username: "admin",
        rol: "ADMINISTRADOR"
      }

      mock.onPost(`${baseUrl}/autenticacion`).reply(200, mockRespuesta)

      const respuesta = await loginService.autenticarUsuarioLogueado(mockAdministrador)

      expect(respuesta.data).toEqual(mockRespuesta)
      expect(respuesta.status).toBe(200)
    })

    test("Maneja correctamente errores de autenticación", async () => {
      const mockAdministrador: Administrador = {
        username: "admin",
        password: "passwordincorrecta",
        rol: "USUARIO"
      }

      mock.onPost(`${baseUrl}/autenticacion`).reply(401, {
        message: "Credenciales inválidas"
      })

      await expect(loginService.autenticarUsuarioLogueado(mockAdministrador))
        .rejects.toThrowError("Request failed with status code 401")
    })
  })
})