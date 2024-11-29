import { beforeEach, describe, expect, test, vi } from "vitest"
import { SeccionAutores } from "./seccion-autores"
import { renderizarConRouting } from "@/data/utils/render-con-routing"
import { autoresService } from "@/data/services/autor.service"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Autor } from "@/data/domain/autor-domain"
import { axiosResponseMockContructor } from "@/data/utils/mockRespuestaAxios"
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster"


const seccionAutores = <ChakraProvider value={defaultSystem}> <SeccionAutores /> </ChakraProvider>

const autoresMock = [
  new Autor(1, "Mary", "Shelley", "Inglés"),
  new Autor(1, "Julio", "Verne", "Francés"),
]

describe('En la seccion de autores, si se obtienen los datos del back', () => {
  beforeEach(()=>{
    vi.clearAllMocks()
    vi.spyOn(autoresService, "obtenerTodos").mockResolvedValue(axiosResponseMockContructor(200,autoresMock))
  })

  test("Se muestran tantas tarjetas como autores", async () => {
    renderizarConRouting(seccionAutores, '/autores')

    const tarjetas = await screen.findAllByTestId("tarjeta-nombre")
    expect(tarjetas.length).toBe(2)
  })

  describe("Si se escribe en la barra de busqueda", () => {
    beforeEach(() => {
      const busquedaMock = [autoresMock[0]]
      vi.spyOn(autoresService, "obtenerPorTexto").mockResolvedValue(axiosResponseMockContructor(200,busquedaMock))
      renderizarConRouting(seccionAutores, '/autores')
    })

    test("Y se presiona el boton, muestra los autores que coinciden con el texto", async () =>{
      const busquedaInput = screen.getByTestId('barra-busqueda-input')
      const busquedaBoton = screen.getByTestId('barra-busqueda-boton')

      await userEvent.type(busquedaInput, 'Shelley')
      await userEvent.click(busquedaBoton)
      const tarjetasAutor = await screen.findAllByTestId('tarjeta-autor')

      waitFor(() => {
        expect(autoresService.obtenerPorTexto).toHaveBeenCalledWith('Shelley')
        expect(tarjetasAutor.length).toBe(1)
      })
    })
    
    test("Y si no se presiona el boton, no hace ningun cambio", async () => {
      const busquedaInput = screen.getByTestId('barra-busqueda-input')
      await userEvent.type(busquedaInput, 'Shelley')
      const tarjetasAutor = await screen.findAllByTestId('tarjeta-autor')
    
      waitFor(() => {
        expect(autoresService.obtenerPorTexto).not.toHaveBeenCalled()
        expect(tarjetasAutor.length).toBe(2)
      })
    })
  })
})

describe('Si no se obtienen datos del back', () => {
  test("Un toaster de error aparece en pantalla", async () => {
    const toasterSpy = vi.spyOn(toaster , "create")
    const error = new Error("Falla en la busqueda de datos")
    vi.spyOn(autoresService, "obtenerTodos").mockRejectedValue(axiosResponseMockContructor(400,error))
    renderizarConRouting(seccionAutores, '/autores')

    await waitFor(() => {
      expect(toasterSpy).toHaveBeenCalledWith(expect.objectContaining({ type: "error" }))
      expect(toasterSpy).toHaveBeenCalledWith(expect.objectContaining({ title: "Error: Falla en la busqueda de datos" }))
    })
  })
})