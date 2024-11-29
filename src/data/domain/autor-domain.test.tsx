import { describe, expect, it } from 'vitest'
import { Autor, autorPorDefecto, validar } from './autor-domain'
import { ErrorResponse } from "@/data/utils/errores"

describe('validar', () => {
    it('Si la validación es correcta, no emite ningún error', () => {
      const autorValido = new Autor(1, "Gabriel", "García Márquez", "Español")
      
      expect(() => validar(autorValido)).not.toThrow()
    })

    it('Emite error si el nombre está vacio', () => {
      const autorSinNombre = new Autor(1, "", "García Márquez", "Español")
      
      try {
        validar(autorSinNombre)
      } catch (error) {
        const errorResponse = error as ErrorResponse
        expect(errorResponse.response.data.message).toBe("Debe agregar un nombre")
      }
    })

    it('Emite error si el apellido está vacio', () => {
      const autorSinApellido = new Autor(1, "Gabriel", "", "Español")
      
      try {
        validar(autorSinApellido)
      } catch (error) {
        const errorResponse = error as ErrorResponse
        expect(errorResponse.response.data.message).toBe("Debe agregar un apellido")
      }
    })

    it('Emite error si el campo de lengua nativa está vacio', () => {
      const autorSinIdioma = new Autor(1, "Gabriel", "García Márquez", "")
      
      try {
        validar(autorSinIdioma)
      } catch (error) {
        const errorResponse = error as ErrorResponse
        expect(errorResponse.response.data.message).toBe("Debe agregar un idioma valido como lengua nativa")
      }
    })

    it('El autor por defecto por default es invalido', () => {
        try {
            validar(autorPorDefecto)
          } catch (error) {
            const errorResponse = error as ErrorResponse
            expect(errorResponse.response.data.message).toBe("Debe agregar un nombre")
          }
    })
  })
