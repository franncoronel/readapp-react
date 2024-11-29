import { renderizarConRouting } from "@/data/utils/render-con-routing"
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { describe, expect, test, vi } from "vitest"
import Layout from "./layout"
import { screen } from "@testing-library/react"

const navegarMock = vi.fn()

const layout = <ChakraProvider value={defaultSystem}> <Layout /> </ChakraProvider>

vi.mock('react-router-dom', async () => {
    const mockedRouter = await vi.importActual('react-router-dom')
    return {
      ...mockedRouter,
      useNavigate: () => navegarMock
    }
  })

describe('Si no hay ningun usuario logueado', () => {
  test("redirige automaticamente a la pantalla de logueo", ()=>{
    vi.clearAllMocks()
    localStorage.clear()
    renderizarConRouting(layout, "/login")
    expect(navegarMock).toHaveBeenCalled()
  })
})

describe('Si hay ningun usuario logueado', () => {
  test("Se muestra en pantalla un header y un footer", ()=>{
    vi.clearAllMocks()
    localStorage.setItem("usuario", "1")
    renderizarConRouting(layout, "/login")

    expect(navegarMock).not.toHaveBeenCalled()
    expect(screen.getByTestId("titulo-header")).toBeTruthy()
    expect(screen.getByTestId("footer")).toBeTruthy()
  })
})