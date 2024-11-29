import { renderizarConRouting } from "@/data/utils/render-con-routing"
import { beforeEach, describe, expect, test, vi } from "vitest"
import Login from "./login"
import { axiosResponseMockContructor } from "@/data/utils/mockRespuestaAxios"
import { loginService } from "@/data/services/login.service"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { toaster } from "@/components/ui/toaster"

const navegarMock = vi.fn()

vi.mock("@/data/errores")
vi.mock('react-router-dom', async () => {
  const mockedRouter = await vi.importActual('react-router-dom')
  return {
    ...mockedRouter,
    useNavigate: () => navegarMock
  }
})

describe('Si ya hay un usuario logueado', () => {
  test("redirige sin tener que ingresar nada", ()=>{
    vi.clearAllMocks()
    localStorage.setItem("usuario","1")
    renderizarConRouting(<ChakraProvider value={defaultSystem}>
      <Login/> </ChakraProvider>, "/login")

    expect(navegarMock).toHaveBeenCalled()
  })
})

describe('No hay un usuario logueado', () =>{
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('Un usuario no tiene las credenciales', () => {
    test("No puede acceder a la pantalla principal", async () => {
      localStorage.clear()
      const respuesta = new Error("El usuario es incorrecto")
      vi.spyOn(loginService, "autenticarUsuarioLogueado").mockRejectedValue(axiosResponseMockContructor(400,respuesta))
      renderizarConRouting(<ChakraProvider value={defaultSystem}>
        <Login/> </ChakraProvider>, "/login")
        
      const toasterSpy = vi.spyOn(toaster, "create")
      const inputUsername = screen.getByTestId('usuario-input')
      const inputPassword = screen.getByTestId('password-input')
      const botonLogin = screen.getByTestId('boton-login')

      await userEvent.type(inputUsername, 'admin')
      await userEvent.type(inputPassword, '12345')
      await userEvent.click(botonLogin)
      
      expect(toasterSpy).toHaveBeenCalledWith(expect.objectContaining({ type: "error" }))
      expect(toasterSpy).toHaveBeenCalledWith(expect.objectContaining({ title: "Error: El usuario es incorrecto" }))
      expect(navegarMock).not.toHaveBeenCalled()
    })
  })
      
  describe('Un usuario tiene las credenciales correctas pero no es administrador', () => {
    test("No redirige a ningun lado y muestra un toaster de error", async () => {
      const respuesta = { password : "12345", username : "admin", rol : "USUARIO" }
      vi.spyOn(loginService, "autenticarUsuarioLogueado").mockResolvedValue(axiosResponseMockContructor(200,respuesta))
      renderizarConRouting(<ChakraProvider value={defaultSystem}>
        <Login/> </ChakraProvider>, "/login")
      const toasterSpy = vi.spyOn(toaster, "create")
      const inputUsername = screen.getByTestId('usuario-input')
      const inputPassword = screen.getByTestId('password-input')
      const botonLogin = screen.getByTestId('boton-login')
          
      await userEvent.type(inputUsername, 'admin')
      await userEvent.type(inputPassword, '12345')
      await userEvent.click(botonLogin)
      
      expect(toasterSpy).toHaveBeenCalledWith(expect.objectContaining({ title: "No tiene permisos para acceder" }))
      expect(navegarMock).not.toHaveBeenCalled()
    })
  })
      
  describe('Un usuario tiene las credenciales correctas y es administrador', () => {
    test("Logra acceder a la pantalla de layout", async () => {
      const respuesta = { password : "12345", username : "admin", rol : "ADMINISTRADOR" }
      vi.spyOn(loginService, "autenticarUsuarioLogueado").mockResolvedValue(axiosResponseMockContructor(200,respuesta))
      renderizarConRouting(<ChakraProvider value={defaultSystem}>
        <Login/> </ChakraProvider>, "/login")
        
      const inputUsername = screen.getByTestId('usuario-input')
      const inputPassword = screen.getByTestId('password-input')
      const botonLogin = screen.getByTestId('boton-login')
            
      await userEvent.type(inputUsername, 'admin')
      await userEvent.type(inputPassword, '12345')
      await userEvent.click(botonLogin)
        
      expect(navegarMock).toHaveBeenCalled()
    })
  })
})
