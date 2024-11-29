import axios from "axios"
import MockAdapter from "axios-mock-adapter"
import { beforeEach, describe, expect, test } from "vitest"
import { dashboardService } from "@/data/services/dashboard.service"
import { URL_SERVIDOR_REST } from "@/data/utils/configuracion"
import { EstadisticaDTO, InactivosDTO } from "@/data/domain/estadisticas.domain"

const mock = new MockAdapter(axios)

describe("DashboardService", () => {
  const baseUrl = URL_SERVIDOR_REST

  beforeEach(() => {
    mock.reset()
  })

  describe("Si se usa obtenerEstadisticas", () => {
    test("Obtiene correctamente las estadísticas", async () => {
      const mockEstadisticas: EstadisticaDTO[] = [
        {
          entidad: "Libros",
          dato: 10
        },
        { 
          entidad: "Centros",
          dato: 50, 
        }
      ]

      mock.onGet(`${baseUrl}/administracion/estadisticas`).reply(200, mockEstadisticas)

      const respuesta = await dashboardService.obtenerEstadisticas()

      expect(respuesta.data).toEqual(mockEstadisticas)
      expect(respuesta.data.length).toBe(2)
    })

    test("Maneja correctamente errores al obtener estadísticas", async () => {
      mock.onGet(`${baseUrl}/administracion/estadisticas`).reply(500)

      await expect(dashboardService.obtenerEstadisticas()).rejects.toThrowError("Request failed with status code 500")
    })
  })

  describe("Si se usa borrarUsuariosInactivos", () => {
    test("Borra usuarios inactivos exitosamente", async () => {
      const mockRespuesta: InactivosDTO = {
        elementoBorrado: "Usuario",
        cantidadBorrado: 80
      }

      mock.onDelete(`${baseUrl}/administracion/usuarios-inactivos`).reply(200, mockRespuesta)

      const respuesta = await dashboardService.borrarUsuariosInactivos()

      expect(respuesta.data).toEqual(mockRespuesta)
      expect(respuesta.status).toBe(200)
    })

    test("Maneja errores al intentar borrar usuarios inactivos", async () => {
      mock.onDelete(`${baseUrl}/administracion/usuarios-inactivos`).reply(400, {
        message: "Error al procesar la solicitud"
      })

      await expect(dashboardService.borrarUsuariosInactivos()).rejects.toThrowError("Request failed with status code 400")
    })
  })

  describe("Si se usa borrarCentrosInactivos", () => {
    test("Borra centros inactivos exitosamente", async () => {
      const mockRespuesta: InactivosDTO = {
        elementoBorrado: "Centros",
        cantidadBorrado: 900
      }

      mock.onDelete(`${baseUrl}/administracion/centros-inactivos`).reply(200, mockRespuesta)

      const respuesta = await dashboardService.borrarCentrosInactivos()

      expect(respuesta.data).toEqual(mockRespuesta)
      expect(respuesta.status).toBe(200)
    })

    test("Maneja errores al intentar borrar centros inactivos", async () => {
      mock.onDelete(`${baseUrl}/administracion/centros-inactivos`).reply(500, {
        message: "Error interno del servidor"
      })

      await expect(dashboardService.borrarCentrosInactivos()).rejects.toThrowError("Request failed with status code 500")
    })
  })
})