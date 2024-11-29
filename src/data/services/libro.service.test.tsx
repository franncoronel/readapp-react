import axios from "axios"
import MockAdapter from "axios-mock-adapter"
import { beforeEach, describe, expect, test } from "vitest"
import { libroService } from "@/data/services/libro.service"
import { URL_SERVIDOR_REST } from "@/data/utils/configuracion"
import { Libro, LibroDTO, validarLibro } from "@/data/domain/libro-domain"
import { Autor } from "@/data/domain/autor-domain"

const mock = new MockAdapter(axios)

describe("LibroService", () => {
  const baseUrl = URL_SERVIDOR_REST

  // Create a mock Autor
  const mockAutor = new Autor(1, "Gabriel", "García Márquez", "Colombiano")

  // Create a mock Libro
  const createMockLibro = (id: number = 1): Libro => new Libro(
    id,
    "Cien Años de Soledad",
    5,
    mockAutor,
    "imagen-url.jpg",
    350,
    75000,
    ['Español', 'Inglés'],
    1000,
    true,
    false
  )

  beforeEach(() => {
    mock.reset()
  })

  describe("Si se usa obtenerTodosLibros", () => {
    test("Obtiene todos los libros correctamente", async () => {
      const mockLibros: LibroDTO[] = [
        {
          id: 1,
          titulo: "Cien Años de Soledad",
          ediciones: 5,
          autor: mockAutor,
          imagen: "imagen-url.jpg",
          paginas: 350,
          palabras: 75000,
          idiomas: ['Español', 'Inglés'],
          ventasSemanales: 1000,
          bestSeller: true,
          desafiante: false
        },
        {
          id: 2,
          titulo: "El Alquimista",
          ediciones: 3,
          autor: mockAutor,
          imagen: "otra-imagen.jpg",
          paginas: 250,
          palabras: 50000,
          idiomas: ['Portugués', 'Español'],
          ventasSemanales: 800,
          bestSeller: true,
          desafiante: true
        }
      ]

      mock.onGet(`${baseUrl}/libros`).reply(200, mockLibros)

      const respuesta = await libroService.obtenerTodosLibros()

      expect(respuesta.data).toEqual(mockLibros)
      expect(respuesta.data.length).toBe(2)
    })
  })

  describe("Si se usa obtenerPorTexto", () => {
    test("Busca libros por texto correctamente", async () => {
      const mockLibros: Libro[] = [
        createMockLibro(1),
        createMockLibro(2)
      ]

      mock.onGet(`${baseUrl}/libros/buscar`).reply(200, mockLibros)

      const respuesta = await libroService.obtenerPorTexto("Soledad")

      expect(respuesta.data).toEqual(mockLibros)
      expect(respuesta.data.length).toBe(2)
    })
  })

  describe("Si se usa obtenerLibroPorId", () => {
    test("Obtiene un libro por ID correctamente", async () => {
      const mockLibro: LibroDTO = {
        id: 1,
        titulo: "Cien Años de Soledad",
        ediciones: 5,
        autor: mockAutor,
        imagen: "imagen-url.jpg",
        paginas: 350,
        palabras: 75000,
        idiomas: ['Español', 'Inglés'],
        ventasSemanales: 1000,
        bestSeller: true,
        desafiante: false
      }

      mock.onGet(`${baseUrl}/libros/1`).reply(200, mockLibro)

      const respuesta = await libroService.obtenerLibroPorId(1)

      expect(respuesta.data).toEqual(mockLibro)
    })
  })

  describe("Si se usa actualizarLibro", () => {
    test("Actualiza un libro correctamente", async () => {
      const libroOriginal = createMockLibro(1)

      const mockLibroDTO: LibroDTO = {
        id: 1,
        titulo: "Cien Años de Soledad (Edición Especial)",
        ediciones: 6,
        autor: mockAutor,
        imagen: "imagen-url.jpg",
        paginas: 375,
        palabras: 75000,
        idiomas: ['Español', 'Inglés', 'Portugués'],
        ventasSemanales: 1200,
        bestSeller: true,
        desafiante: true
      }

      mock.onPut(`${baseUrl}/libros`).reply(200, mockLibroDTO)

      const respuesta = await libroService.actualizarLibro(libroOriginal)

      expect(respuesta.data).toEqual(mockLibroDTO)
    })
  })

  describe("Si se usa eliminarLibro", () => {
    test("Elimina un libro correctamente", async () => {
      const libroAEliminar = createMockLibro(1)

      mock.onDelete(`${baseUrl}/libros/1`).reply(200)

      const respuesta = await libroService.eliminarLibro(libroAEliminar)

      expect(respuesta.status).toBe(200)
    })
  })

  describe("Si se usa agregarLibro", () => {
    test("Agrega un nuevo libro correctamente", async () => {
      const nuevoLibro = createMockLibro(0)
      
      const mockLibroDTO: LibroDTO = {
        id: 3,
        titulo: "Cien Años de Soledad",
        ediciones: 5,
        autor: mockAutor,
        imagen: "imagen-url.jpg",
        paginas: 350,
        palabras: 75000,
        idiomas: ['Español', 'Inglés'],
        ventasSemanales: 1000,
        bestSeller: true,
        desafiante: false
      }

      mock.onPost(`${baseUrl}/libros`).reply(201, mockLibroDTO)

      const respuesta = await libroService.agregarLibro(nuevoLibro)

      expect(respuesta.data).toEqual(mockLibroDTO)
      expect(respuesta.status).toBe(201)
    })

    test("No permite agregar libro inválido", async () => {
      const libroInvalido = new Libro(0, '', 0, new Autor(0, '', '', ''), '', 0, 0, [], 0, false, false)

      await expect(libroService.agregarLibro(libroInvalido)).rejects.toThrowError("Request failed with status code 404")
    })
  })

  // Pruebas adicionales de validación
  describe("Validación de Libro", () => {
    test("Valida libro correctamente", () => {
      const libroValido = createMockLibro()
      expect(validarLibro(libroValido)).toBe(true)
    })

    test("Rechaza libro con título vacío", () => {
      const libroInvalido = new Libro(
        1, 
        '', 
        5, 
        mockAutor, 
        "imagen-url.jpg", 
        350, 
        75000, 
        ['Español'], 
        1000, 
        true, 
        false
      )
      expect(validarLibro(libroInvalido)).toBe(false)
    })
  })
})