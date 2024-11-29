import { renderizarConRouting } from "@/data/utils/render-con-routing"
import { describe, test, expect, vi } from "vitest"
import EditarLibro from "../editar-libro"
import { validarLibro, mockEditado } from "@/data/domain/libro-domain"
import { libroService } from "@/data/services/libro.service"
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"


const navegarMock = vi.fn()

vi.mock("@/data/errores")
vi.mock('react-router-dom', async () => {
  const mockedRouter = await vi.importActual('react-router-dom')
  return {
    ...mockedRouter,
    useNavigate: () => navegarMock
  }
})

describe('EditarLibro', () => {
  const editarLibro = <ChakraProvider value={defaultSystem}> <EditarLibro /> </ChakraProvider>

  test("renderiza el componente correctamente", () => {
    renderizarConRouting(editarLibro, "/editar-libro/1")
    expect(editarLibro).toBeTruthy()
  })

  test('Se guarda cuando el libro ediatdo es válido', async () => {
    const agregarLibroMock = vi.fn().mockResolvedValueOnce({});
    vi.spyOn(libroService, 'agregarLibro').mockImplementation(agregarLibroMock)
    validarLibro(mockEditado)
    await agregarLibroMock(mockEditado)
    expect(agregarLibroMock).toHaveBeenCalledWith(mockEditado)
  })
})