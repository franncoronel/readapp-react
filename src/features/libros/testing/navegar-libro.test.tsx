import { describe, expect, test, vi } from "vitest";
import NavegarLibros from "../navegar-libro";
import { renderizarConRouting } from "@/data/utils/render-con-routing";
import { libroService } from "@/data/services/libro.service";
import { waitFor, screen, fireEvent } from "@testing-library/react";
import { mockListaLibros } from "@/data/domain/libro-domain";
import { axiosResponseMockContructor } from "@/data/utils/mockRespuestaAxios";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

const navegarLibros = <ChakraProvider value={defaultSystem}> <NavegarLibros/> </ChakraProvider>
const navegarMock = vi.fn()
const render = () => {
    renderizarConRouting(navegarLibros, '/libros')
}

vi.mock("@/data/errores")
vi.mock('react-router-dom', async () => {
  const mockedRouter = await vi.importActual('react-router-dom')
  return {
    ...mockedRouter,
    useNavigate: () => navegarMock
  }
})

vi.mock('@/data/libroService', () => ({
    obtenerTodosLibros: vi.fn(),
    obtenerPorTexto: vi.fn(),
    eliminarLibro: vi.fn(),
  }))


describe('Cuando se renderiza el componente de navegación', () => {

    test('Se renderiza el componente', () => {
        render()
        expect(navegarLibros).toBeTruthy()
    })

    test('Se cargan los libros', () => {
        vi.spyOn(libroService, 'obtenerTodosLibros').mockResolvedValue(axiosResponseMockContructor(200,mockListaLibros))
        render()
        expect(libroService.obtenerTodosLibros).toHaveBeenCalled()
    })

    test('Se busca un libro que existe', async () => {
        const busquedaMock = [
            {
                id: 1,
                titulo: 'Libro 1',
                autor: { nombre: 'Juan', apellido: 'Pérez' },
                imagen: 'imagen.jpg',
                paginas: 100,
                palabras: 2000,
                idiomas: ['Español'],
                ventasSemanales: 500,
                bestSeller: true,
                lecturaCompleja: false,
              }
        ]
        vi.spyOn(libroService, "obtenerPorTexto").mockResolvedValue(axiosResponseMockContructor(200,busquedaMock))
        render()
        const busquedaInput = screen.getByTestId('barra-busqueda-input')
        const busquedaBoton = screen.getByTestId('barra-busqueda-boton')
        fireEvent.change(busquedaInput, { target: { value: 'Libro 1' } })
        fireEvent.click(busquedaBoton)
        await waitFor(() => {
          expect(libroService.obtenerPorTexto).toHaveBeenCalledWith('Libro 1')
        })
      })
})