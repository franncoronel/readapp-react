import { beforeEach, describe, expect, test, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderizarConRouting } from '@/data/utils/render-con-routing'
import App from './App'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { axiosResponseMockContructor } from '@/data/utils/mockRespuestaAxios'
import { autoresService } from '@/data/services/autor.service'

describe("Nombre de ruta actual", () => {

  const app = <ChakraProvider value={defaultSystem} ><App/> </ChakraProvider>

  beforeEach( () => {
    localStorage.clear()
  })
  
  test("El Header muestra el nombre de la vista dashboard", () => {
    localStorage.setItem("usuario","1")
    renderizarConRouting(app, '/my/dashboard')
    const textoHeader = screen.getByTestId("titulo-header").textContent
    expect(textoHeader).toEqual("ReadApp / Dashboard")
  })

  test("El Header muestra el nombre de la vista de libros", () => {
    localStorage.setItem("usuario","1")
    renderizarConRouting(app, '/my/libros')
    const textoHeader = screen.getByTestId("titulo-header").textContent
    expect(textoHeader).toEqual("ReadApp / Libros")
  })

  test("El Header muestra el nombre de la vista crear libro", () => {
    localStorage.setItem("usuario","1")
    renderizarConRouting(app, '/my/libros/crear-libro')
    const textoHeader = screen.getByTestId("titulo-header").textContent
    expect(textoHeader).toEqual("ReadApp / Agregar Libro")
  })

  test("El Header muestra el nombre de la vista editar libro", () => {
    localStorage.setItem("usuario","1")
    vi.spyOn(autoresService, 'obtenerTodos').mockResolvedValue(axiosResponseMockContructor(200,[]))//La vista hace un par de pedidos antes de formarse, lo que empieza a tirar errores que no son capturados, debe resolverse en la vista en si misma
    renderizarConRouting(app, '/my/libros/1')
    const textoHeader = screen.getByTestId("titulo-header").textContent
    expect(textoHeader).toEqual("ReadApp / Editar Libro")
  })

  test("El Header muestra el nombre de la vista de autores", () => {
    localStorage.setItem("usuario","1")
    renderizarConRouting(app, '/my/autores')
    const textoHeader = screen.getByTestId("titulo-header").textContent
    expect(textoHeader).toEqual("ReadApp / Autores")
  })

  test("El Header muestra el nombre de la vista de agregar autor", () => {
    localStorage.setItem("usuario","1")
    renderizarConRouting(app, '/my/autores/nuevo-autor')
    const textoHeader = screen.getByTestId("titulo-header").textContent
    expect(textoHeader).toEqual("ReadApp / Agregar Autor")
  })

  test("El Header muestra el nombre de la vista de editar autor", async () => {
    localStorage.setItem("usuario","1")
    renderizarConRouting(app, '/my/autores/1')
    const header = screen.getByTestId("titulo-header")
    expect(header.textContent).toEqual("ReadApp / Editar Autor")
  })
})