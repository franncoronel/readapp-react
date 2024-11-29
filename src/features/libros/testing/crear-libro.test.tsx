import { describe, test, expect, vi } from 'vitest'
import { renderizarConRouting } from '@/data/utils/render-con-routing'
import CrearLibro from '../crear-libro'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { autoresService } from '@/data/services/autor.service'
import { lenguajeService } from '@/data/services/Idiomas'
import { waitFor } from '@testing-library/react'
import { axiosResponseMockContructor } from '@/data/utils/mockRespuestaAxios'
import { Autor } from '@/data/domain/autor-domain'
import MockAdapter from 'axios-mock-adapter'
import { URL_SERVIDOR_REST } from '@/data/utils/configuracion'
import { mockLibro } from '@/data/domain/libro-domain'
import { libroService } from '@/data/services/libro.service'
import axios from 'axios'

const crearLibro = <ChakraProvider value={defaultSystem}><CrearLibro></CrearLibro></ChakraProvider>
const render = () => {renderizarConRouting(crearLibro, '/crear-libro')}
const mockAutor = new Autor(0,"","","")
const baseUrl = URL_SERVIDOR_REST
let mockAxios: MockAdapter

vi.mock("@/data/errores")

describe('Cuando se quiere crear un libro', () => {

  test('Se renderiza el componente correctamente', async () => {
    render()
    expect(crearLibro).toBeTruthy()
  })

  test('Se carga la lista de autores e idiomas y se puede crear un libro', async () => {
    vi.spyOn(lenguajeService, "obtenerLenguajes").mockResolvedValue(axiosResponseMockContructor(200,["Inglés", "Español"]))
    vi.spyOn(autoresService, "obtenerTodos").mockResolvedValue(axiosResponseMockContructor(200,[mockAutor]))
    render()
    await waitFor(() => {
      expect(autoresService.obtenerTodos).toHaveBeenCalled()
      expect(lenguajeService.obtenerLenguajes).toHaveBeenCalled()
    })
  })

    test('Se puede crear un libro válido', async () => {
      mockAxios = new MockAdapter(axios)
      mockAxios.onPost(`/${baseUrl}/libros`).reply(200, {})
      const guardarSpy = vi.spyOn(libroService, 'agregarLibro')

      await waitFor(() => {
        libroService.agregarLibro(mockLibro)
      })

      expect(guardarSpy).toHaveBeenCalledWith(mockLibro)
    })

})