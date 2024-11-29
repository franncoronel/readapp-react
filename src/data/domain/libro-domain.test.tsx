import { describe, expect, test } from 'vitest'
import { Libro, LibroActualizado, validarLibro, actualizarLibro } from './libro-domain'
import { Autor } from './autor-domain'
import { mockLibro } from './libro-domain'

describe('Libro Domain', () => {
  describe('Cuando se valida un libro', () => {
    test('Un libro válido cumple con las condiciones', () => {
      const libroValido = new Libro(1, 'Título del Libro', 2, 
        new Autor(1, 'Nombre', 'Apellido', 'Español'), 
        'imagen.jpg', 100, 5000, ['Español'], 50, false, false)
      
      expect(validarLibro(libroValido)).toBeTruthy()
    })

    test('Un libro sin título no es válido', () => {
      const libroInvalido = new Libro(1, '   ', 2, 
        new Autor(1, 'Nombre', 'Apellido', 'Español'), 
        'imagen.jpg', 100, 5000, ['Español'], 50, false, false)
      
      expect(validarLibro(libroInvalido)).toBeFalsy()
    })

    test('Un libro con autor nulo no es válido', () => {
      const libroInvalido = new Libro(1, 'Título', 2, 
        null as never, 
        'imagen.jpg', 100, 5000, ['Español'], 50, false, false)
      
      expect(validarLibro(libroInvalido)).toBeFalsy()
    })

    test('Un libro con ediciones menores o iguales a 0 no es válido', () => {
      const libroInvalido = new Libro(1, 'Título', 0, 
        new Autor(1, 'Nombre', 'Apellido', 'Español'), 
        'imagen.jpg', 100, 5000, ['Español'], 50, false, false)
      
      expect(validarLibro(libroInvalido)).toBeFalsy()
    })
  })

  describe('Cuando se actualiza un libro', () => {
    test('Se actualizan los campos correctamente', () => {
      const libroOriginal = mockLibro
      const datosActualizacion: LibroActualizado = {
        titulo: 'Nuevo Título',
        autor: new Autor(2, 'Nuevo', 'Autor', 'Inglés'),
        ediciones: 5,
        paginas: 200,
        ventasSemanales: 100,
        lecturaCompleja: false,
        idiomas: ['Inglés', 'Español']
      }

      const libroActualizado = actualizarLibro(libroOriginal, datosActualizacion)

      expect(libroActualizado.titulo).toBe('Nuevo Título')
      expect(libroActualizado.autor.nombre).toBe('Nuevo')
      expect(libroActualizado.ediciones).toBe(5)
      expect(libroActualizado.paginas).toBe(200)
      expect(libroActualizado.ventasSemanales).toBe(100)
      expect(libroActualizado.lecturaCompleja).toBe(false)
      expect(libroActualizado.idiomas).toEqual(['Inglés', 'Español'])
      
      // Verificar que los campos no actualizados se mantienen igual
      expect(libroActualizado.id).toBe(libroOriginal.id)
      expect(libroActualizado.imagen).toBe(libroOriginal.imagen)
      expect(libroActualizado.palabras).toBe(libroOriginal.palabras)
      expect(libroActualizado.bestSeller).toBe(libroOriginal.bestSeller)
    })

    test('Se pueden actualizar campos parcialmente', () => {
      const libroOriginal = mockLibro
      const datosActualizacion: LibroActualizado = {
        titulo: 'Nuevo Título',
        autor: null as never,
        ediciones: null as never,
        paginas: null as never,
        ventasSemanales: null as never,
        lecturaCompleja: null as never,
        idiomas: null as never
      }

      const libroActualizado = actualizarLibro(libroOriginal, datosActualizacion)

      expect(libroActualizado.titulo).toBe('Nuevo Título')
      expect(libroActualizado.autor).toBe(libroOriginal.autor)
      expect(libroActualizado.ediciones).toBe(libroOriginal.ediciones)
    })
  })

  describe('Cuando se crea un libro desde DTO', () => {
    test('Se mapea correctamente desde DTO', () => {
      const libroDTO = {
        id: 1,
        titulo: 'Título del Libro',
        ediciones: 2,
        autor: {
          id: 1,
          nombre: 'Nombre',
          apellido: 'Apellido',
          lenguaNativa: 'Español'
        },
        imagen: 'imagen.jpg',
        paginas: 100,
        palabras: 5000,
        idiomas: ['Español'],
        ventasSemanales: 50,
        bestSeller: true,
        desafiante: false
      }

      const libro = Libro.fromDTO(libroDTO)

      expect(libro.id).toBe(1)
      expect(libro.titulo).toBe('Título del Libro')
      expect(libro.autor.nombre).toBe('Nombre')
      expect(libro.idiomas).toEqual(['Español'])
    })
  })
})