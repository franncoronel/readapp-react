import { beforeEach, describe, expect, test, vi } from "vitest"
import { NuevoAutor } from "./nuevo-autor"
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { renderizarConRouting } from '@/data/utils/render-con-routing'
import { autoresService } from "@/data/services/autor.service"
import { Autor } from "@/data/domain/autor-domain"
import { toaster } from "@/components/ui/toaster"
import { lenguajeService } from "@/data/services/Idiomas"
import { axiosResponseMockContructor } from "@/data/utils/mockRespuestaAxios"
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"

const nuevoAutor = <ChakraProvider value={defaultSystem}> <NuevoAutor /> </ChakraProvider>

const navegarMock = vi.fn()

vi.mock("@/data/errores")
vi.mock('react-router-dom', async () => {
  const mockedRouter = await vi.importActual('react-router-dom')
  return {
    ...mockedRouter,
    useNavigate: () => navegarMock
  }
})

describe('Nuevo Autor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(lenguajeService, "obtenerLenguajes").mockResolvedValue(axiosResponseMockContructor(200,["Inglés", "Español"]))
  })
  test("muestra valores por defecto en los campos", () => {
    renderizarConRouting(nuevoAutor, "/nuevo-autor")
    
    expect(screen.getByPlaceholderText("nombre").getAttribute("value")).toBe("")
    expect(screen.getByPlaceholderText("apellido").getAttribute("value")).toBe("")
  })
  
  test("Se carga la lista de idiomas correctamente", async () => {
    const idiomas = ["Inglés", "Español"]
    renderizarConRouting(nuevoAutor, "/nuevo-autor")
    await waitFor(() => {
      idiomas.forEach(idioma => {
        const elemento = screen.getByText(idioma)
        expect(elemento).toBeTruthy()
      })
    })
  }) 
  
  describe('Si se presiona el boton de guardar', () => {
    const autorCreado = new Autor(0,"Gabriel","García Marquez", "Español")
    const procesoDeGuardado = async () => {
      renderizarConRouting(nuevoAutor, "/nuevo-autor")
      fireEvent.change(screen.getByTestId("autor-nombre"), {target: {value: 'Gabriel'}})
      fireEvent.change(screen.getByTestId("autor-apellido"), {target: {value: 'García Marquez'}})
      fireEvent.change(await screen.findByTestId("autor-lengua"), { target: { value: "Español" } })
      fireEvent.click(screen.getByText("Guardar"))
    }

    test("guarda el nuevo autor correctamente", async () => {
      const guardarSpy = vi.spyOn(autoresService, "nuevo").mockResolvedValue(axiosResponseMockContructor(200, autorCreado))
      
      await procesoDeGuardado()
      
      expect(guardarSpy).toHaveBeenCalledWith(expect.objectContaining({
        nombre: "Gabriel",
        apellido: "García Marquez",
        lenguaNativa: "Español"
      }))
    })
    
    test("muestra un toaster de exito", async () => {
      const toasterSpy = vi.spyOn(toaster, "create")

      await procesoDeGuardado()
      
      await waitFor(() => {
        expect(toasterSpy).toHaveBeenCalledWith(expect.objectContaining({
          type: "success",
          title: expect.stringContaining(`Se creo el autor Gabriel García Marquez`)
        }))
      })
    })

    test("Bloquea el boton de guardado", async () => {
      const guardarSpy = vi.spyOn(autoresService, "nuevo").mockResolvedValue(axiosResponseMockContructor(200, autorCreado))

      await procesoDeGuardado()
      fireEvent.click(await screen.findByTestId("boton-guardar"))
      fireEvent.click(await screen.findByTestId("boton-guardar"))
      fireEvent.click(await screen.findByTestId("boton-guardar"))
      fireEvent.click(await screen.findByTestId("boton-guardar"))
      fireEvent.click(await screen.findByTestId("boton-guardar"))

      expect(guardarSpy).toHaveBeenCalledOnce()
    })
  })
})

describe('Si no se obtienen datos desde el back', () => {
  test("Muestra un toaster de error", async () => {
    vi.spyOn(lenguajeService, "obtenerLenguajes").mockRejectedValue(axiosResponseMockContructor(400, new Error("Error en la carga de idiomas")))
    const toasterSpy = vi.spyOn(toaster, "create")
    renderizarConRouting(nuevoAutor, "/nuevo-autor")

    await waitFor(() => {
      expect(toasterSpy).toHaveBeenCalledWith(expect.objectContaining({
        type: "error",
        title: expect.stringContaining(`Error en la carga de idiomas`)
      }))
    })
  })

  test("Redirige a otra pantalla", async () => {
    vi.spyOn(lenguajeService, "obtenerLenguajes").mockRejectedValue(axiosResponseMockContructor(400, "Error en la carga de idionas"))
    vi.useFakeTimers()
    renderizarConRouting(nuevoAutor, "/nuevo-autor")
    vi.runAllTimers()
    waitFor(() => expect(navegarMock).toHaveBeenCalled())
    vi.useRealTimers()
  })
})