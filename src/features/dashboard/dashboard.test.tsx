import { screen, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { dashboardService } from "@/data/services/dashboard.service"
import { renderizarConRouting } from "@/data/utils/render-con-routing"
import Dashboard from "./dashboard"
import { axiosResponseMockContructor } from "@/data/utils/mockRespuestaAxios"
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import userEvent from "@testing-library/user-event"




const mockTarjetas = [
  {entidad: "Usuarios", dato: 10},
  {entidad: "Libros", dato: 25}
]

describe("Dashboard Component", () => {
  const dashboard = <ChakraProvider value={defaultSystem}> <Dashboard /> </ChakraProvider>
  const usuario = userEvent.setup()

  beforeEach(() => {
    vi.spyOn(dashboardService, "obtenerEstadisticas").mockResolvedValue(axiosResponseMockContructor(200, mockTarjetas))
    vi.spyOn(dashboardService, "borrarUsuariosInactivos").mockResolvedValue(axiosResponseMockContructor(200, { cantidadBorrado: 10 }))
    vi.spyOn(dashboardService, "borrarCentrosInactivos").mockResolvedValue(axiosResponseMockContructor(200, { cantidadBorrado: 5 }))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it("debería renderizar el título principal y el secundario con sus respectivos contenidos", () => {
    renderizarConRouting(dashboard, "/dashboard")

    expect(screen.getByTestId("titulo-principal")).toBeDefined()
    expect(screen.getByTestId("titulo-secundario")).toBeDefined()
    
    const tituloPrincipal = screen.getByTestId("titulo-principal")
    const tituloSecundario = screen.getByTestId("titulo-secundario")
      
    expect(tituloPrincipal.textContent).toBe("Indicadores")
    expect(tituloSecundario.textContent).toBe("Acciones")
  })

  it("debería renderizar las tarjetas de estadísticas", async () => {
    renderizarConRouting(dashboard, "/dashboard")

    await waitFor(async () => {
      expect(screen.queryByTestId("tarjeta-Usuarios totales")).toBeTruthy()
      expect(screen.queryByTestId("tarjeta-Libros en Sistema")).toBeTruthy()
    })
  })

  it("debería abrir el popup de confirmación al hacer clic en Borrar usuarios inactivos", async () => {
    renderizarConRouting(dashboard, "/dashboard")

    const botonBorrarUsuarios = screen.getByTestId("boton-usuarios")
    await usuario.click(botonBorrarUsuarios)
    const popupConfirmacion = screen.getByText("¿Seguro que quiere borrar los usuarios inactivos?") //No pude encontrar el data-test que le correspondia
    expect(popupConfirmacion).toBeDefined()
  })

  it("debería llamar a borrarUsuariosInactivos cuando se confirma el borrado de usuarios", async () => {
    renderizarConRouting(dashboard, "/dashboard")

    const borrarUsuariosSpy = vi.spyOn(dashboardService, "borrarUsuariosInactivos")
    const botonBorrarUsuarios = screen.getByTestId("boton-usuarios")
    await usuario.click(botonBorrarUsuarios)
    const botonesConfirmar = screen.getAllByTestId("aceptar-eliminar")
    const botonConfirmar = botonesConfirmar[botonesConfirmar.length - 1]
    await usuario.click(botonConfirmar)

    await waitFor(() => {
      expect(borrarUsuariosSpy).toHaveBeenCalledOnce()
    })
  })

  it("debería llamar a borrarCentrosInactivos cuando se confirma el borrado de centros", async () => {
    renderizarConRouting(dashboard, "/dashboard")

    const borrarCentrosSpy = vi.spyOn(dashboardService, "borrarCentrosInactivos")
    const botonBorrarCentros = screen.getByTestId("boton-centros")
    await usuario.click(botonBorrarCentros)
    const botonesConfirmar = screen.getAllByTestId("aceptar-eliminar")
    const botonConfirmar = botonesConfirmar[0]
    await usuario.click(botonConfirmar)

    await waitFor(() => {
      expect(borrarCentrosSpy).toHaveBeenCalledOnce()
    })
  })

  it("debería mostrar un toast de éxito después de borrar usuarios", async () => {
    renderizarConRouting(dashboard, "/dashboard")

    const botonBorrarUsuarios = screen.getByTestId("boton-usuarios")
    await usuario.click(botonBorrarUsuarios)
    const botonesConfirmar = screen.getAllByTestId("aceptar-eliminar")
    const botonConfirmar = botonesConfirmar[1]
    await usuario.click(botonConfirmar)

    await waitFor(() => {
      const toastExitoso = screen.getByText("Fueron eliminados 10 usuarios")
      expect(toastExitoso).toBeDefined()
    })
  })

})