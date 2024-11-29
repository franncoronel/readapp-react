import { beforeEach, describe, expect, test, vi } from "vitest"
import { EdicionAutor } from "./edicion-autores"
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { renderizarConRouting } from '@/data/utils/render-con-routing'
import { autoresService } from "@/data/services/autor.service"
import { toaster } from "@/components/ui/toaster"
import { Autor } from "@/data/domain/autor-domain"
import { lenguajeService } from "@/data/services/Idiomas"
import { axiosResponseMockContructor } from "@/data/utils/mockRespuestaAxios"
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"

const autorPrueba = new Autor(1, "Mary", "Shelley", "Español")

const edicionAutor = <ChakraProvider value={defaultSystem}> <EdicionAutor /> </ChakraProvider>

const navegarMock = vi.fn()

vi.mock('react-router-dom', async () => {
  const mockedRouter = await vi.importActual('react-router-dom')
  return {
    ...mockedRouter,
    useNavigate: () => navegarMock,
    useParams: vi.fn().mockReturnValue({ id: "1" })
  }
})

describe('En la edicion de autores, si se obtienen los datos del back', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(lenguajeService, "obtenerLenguajes").mockResolvedValue(axiosResponseMockContructor(200,["Inglés", "Español"]))
    vi.spyOn(autoresService, "obtenerPorId").mockResolvedValue(axiosResponseMockContructor(200,autorPrueba))
  })

  test("se cargan los datos del autor donde corresponde", async () => {
    renderizarConRouting(edicionAutor, "/my/autores/1")
    await waitFor(() => {
      expect(screen.getByTestId("autor-nombre").getAttribute("value")).toBe(autorPrueba.nombre)
      expect(screen.getByTestId("autor-apellido").getAttribute("value")).toBe(autorPrueba.apellido)
    })
  })

  describe("Si se modifican los campos y presiona el boton de guardar", () => {
    const guardarSpy = vi.spyOn(autoresService, "guardar").mockResolvedValue(axiosResponseMockContructor(200,autorPrueba))
    beforeEach(async () => {
      vi.spyOn(autoresService, "obtenerPorId").mockResolvedValue(axiosResponseMockContructor(200,autorPrueba))
      renderizarConRouting(edicionAutor, "/my/autores/1")

      await waitFor(() => expect(screen.getByDisplayValue("Mary")).toBeTruthy())
      fireEvent.change(screen.getByTestId("autor-nombre"), {target: {value: 'Jose'}})
      fireEvent.change(screen.getByTestId("autor-apellido"), {target: {value: 'Socotroco'}})
      fireEvent.change(screen.getByTestId("autor-lengua"), { target: { value: "Inglés" } })

    })
    test("Se emite junto a la funcion de guardar los datos del autor editado", async () => {
      fireEvent.click(screen.getByTestId("boton-guardar"))
      expect(guardarSpy).toHaveBeenCalledWith( { id: 1, nombre: "Jose", apellido: "Socotroco", lenguaNativa: "Inglés"} )
    })

    test("Bloquea el boton de guardar", async () => {
      fireEvent.click(await screen.findByTestId("boton-guardar"))
      fireEvent.click(await screen.findByTestId("boton-guardar"))
      fireEvent.click(await screen.findByTestId("boton-guardar"))
      fireEvent.click(await screen.findByTestId("boton-guardar"))
      fireEvent.click(await screen.findByTestId("boton-guardar"))

      expect(guardarSpy).toHaveBeenCalledOnce()
    })

    test("muestra mensaje de éxito", async () => {
      const toasterSpy = vi.spyOn(toaster, "create")
      fireEvent.click(screen.getByText("Guardar"))
  
      await waitFor(() => {
        expect(toasterSpy).toHaveBeenCalledWith(expect.objectContaining({
          type: "success",
          title: expect.stringContaining("Jose Socotroco actualizado con exito")
        }))
      })
    })
  })

  describe("Si ocurre un error al guardar", () => {
    test("Muestra un toaster de error", async () => {
      vi.spyOn(autoresService, "obtenerPorId").mockResolvedValue(axiosResponseMockContructor(200,autorPrueba))
      vi.spyOn(autoresService, "guardar").mockRejectedValue(axiosResponseMockContructor(400,new Error("no se guardaron los datos")))
      const toasterSpy = vi.spyOn(toaster, "create")
      
      renderizarConRouting(edicionAutor, "/my/autores/1")
      
      await waitFor(() => expect(screen.getByDisplayValue("Mary")).toBeTruthy())
      fireEvent.click(screen.getByText("Guardar"))
      
      await waitFor(() => {
        expect(toasterSpy).toHaveBeenCalledWith(expect.objectContaining({
          type: "error",
          title: expect.stringContaining("no se guardaron los datos")
        }))
      })
    })
  })

  describe("Se modifican los campos y se presiona el boton cancelar", async () => {
    test("Se ponen los datos del autor que estaban antes de ser modificados", () => {
      renderizarConRouting(edicionAutor, "/autores/1")
      fireEvent.change(screen.getByTestId("autor-nombre"), {target: {value: 'Jose'}})
      fireEvent.change(screen.getByTestId("autor-apellido"), {target: {value: 'Socotroco'}})      
      fireEvent.click(screen.getByText("Cancelar"))

      waitFor(()=>{
        expect(screen.getByTestId("autor-nombre").getAttribute("value")).toBe(autorPrueba.nombre)
        expect(screen.getByTestId("autor-apellido").getAttribute("value")).toBe(autorPrueba.apellido)
      })
    })
    
    test("Se redirige a la seccion de autores", () => {
      vi.useFakeTimers()
      renderizarConRouting(edicionAutor, "/autores/1")
  
      fireEvent.click(screen.getByText("Cancelar"))
      vi.runAllTimers()
  
      expect(navegarMock).toHaveBeenCalled()
      vi.useRealTimers()
    })
  })
})

describe("Si no se obtienen datos del back", () => {
  test("Muestra un toaster de error", async () => {
    vi.spyOn(autoresService, "obtenerPorId").mockRejectedValue(axiosResponseMockContructor(400, new Error("Error al cargar autor")))
    const toasterSpy = vi.spyOn(toaster, "create")
    renderizarConRouting(edicionAutor, "/my/autores/1")

    await waitFor(() => {
      expect(toasterSpy).toHaveBeenCalledWith(expect.objectContaining({ type: "error" }))
    })
  })
})