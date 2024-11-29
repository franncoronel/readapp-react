import axios from "axios"
import MockAdapter from "axios-mock-adapter"
import { Autor } from "@/data/domain/autor-domain"
import { beforeEach, describe, expect, test } from "vitest"
import { autoresService } from "@/data/services/autor.service"
import { URL_SERVIDOR_REST } from "@/data/utils/configuracion"

const mock = new MockAdapter(axios)

describe("AutorService", () => {
  const baseUrl = URL_SERVIDOR_REST

  beforeEach(() => {
    mock.reset()
  })

  describe("Si se usa obtenerPorId", () => {
    test("Trae un usuario desde el back coincidiendo con su id", async () => {
      const mockAutor = new Autor(1, "Gallo", "Claudio", "Español")
      mock.onGet(`${baseUrl}/autores/1`).reply(200, mockAutor)

      const respuesta = await autoresService.obtenerPorId(1)

      expect(respuesta.data).toEqual(mockAutor)
    })

    test("Recibo un error ya que no encuentra ninguna coincidencia", async () => {
      const error = { message: "No se encontraron coincidencias" }
      mock.onGet(`${baseUrl}/autores/99009`).reply(404, error)

      await expect(autoresService.obtenerPorId(99009)).rejects.toThrowError("Request failed with status code 404")
    })
  })

  describe("Si se usa obtenerTodos", () => {
    test("Se obtienen todos los resultados", async () => {
      const mockAutores: Autor[] = [
        { id: 1, nombre: "Hanna", apellido: "Diyab", lenguaNativa: "Arabe" },
        { id: 2, nombre: "Horacio", apellido: "Quiroga", lenguaNativa: "Español" },
      ]

      mock.onGet(`${baseUrl}/autores`).reply(200, mockAutores)

      const result = await autoresService.obtenerTodos()

      expect(result.data).toEqual(mockAutores)
    })
  })

  describe("Si se usa guardar", () => {
    test("Guarda un autor modificado", async () => {
      const autorModificado = new Autor(1, "Gabriel", "García Márquez", "Español")
      mock.onPut(`${baseUrl}/autores/1`).reply(200, autorModificado)

      const respuesta = await autoresService.guardar(autorModificado)

      expect(respuesta.data).toEqual(autorModificado)
    })

    test("Lanza un error antes de hacer un pedido invalidos", async () => {
      const autorInvalido = new Autor(1, "Julio", "", "Español") // Datos inválidos
      mock.onPut(`${baseUrl}/autores/1`).reply(400, { message: "Datos inválidos" })

      expect(autoresService.nuevo(autorInvalido)).rejects.toMatchObject({
        response:
          {data:
            {message:
              "Debe agregar un apellido"
            }
          }
      })
    })
  })

  describe("Si se usa nuevo", () => {
    test("Crea un nuevo autor y lo recupera como respuesta", async () => {
      const nuevoAutor = new Autor(3, "Jorge", "Luis Borges", "Español")
      mock.onPost(`${baseUrl}/administracion/agregar-autor`).reply(201, nuevoAutor)

      const respuesta = await autoresService.nuevo(nuevoAutor)

      expect(respuesta.data).toEqual(nuevoAutor)
    })

    test("Lanza un error antes de que haga post un autor invalido", async () => {
      const autorInvalido = new Autor(0, "", "", "")
      mock.onPost(`${baseUrl}/administracion/agregar-autor`).reply(400, { message: "Datos inválidos" })

      expect(autoresService.nuevo(autorInvalido)).rejects.toMatchObject({
        response:
          {data:
            {message:
              "Debe agregar un nombre"
            }
          }
      })
    })
  })

  describe("Si se usa eliminar", () => {
    test("Elimina un autor exitosamente", async () => {
      const autorAEliminar = new Autor(1, "Gallo", "Claudio", "Español")
      mock.onDelete(`${baseUrl}/autores/1`).reply(200)

      const respuesta = await autoresService.eliminar(autorAEliminar)

      expect(respuesta.status).toBe(200)
    })

    test("Lanza un error al intentar eliminar un autor inexistente", async () => {
      const autorInexistente = new Autor(999, "Señor", "Nadie", "Klingon")
      mock.onDelete(`${baseUrl}/autores/999`).reply(404, { message: "No se encontró el autor" })

      await expect(autoresService.eliminar(autorInexistente)).rejects.toThrowError("Request failed with status code 404")
    })
  })
})
