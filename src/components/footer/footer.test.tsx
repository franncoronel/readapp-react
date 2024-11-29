import { describe, expect, test, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Footer from './footer'
import { renderizarConRouting } from '@/data/utils/render-con-routing'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'

const footer = <ChakraProvider value={defaultSystem}> <Footer/> </ChakraProvider>

const navegarMock = vi.fn()
vi.mock('react-router-dom', async () => {
  const mockedRouter = await vi.importActual('react-router-dom')

  return {
    ...mockedRouter,
    useNavigate: () => navegarMock,
  }
})

describe('Footer', () => {
  test('Footer se crea sin errores', () => {
    renderizarConRouting(footer, '/')
    expect(footer).toBeTruthy()
  })

  test("El Footer muestra los logos", () => {
    renderizarConRouting(footer, '/')
    expect(screen.getByTestId('logo-dashboard')).toBeTruthy()
    expect(screen.getByTestId('logo-libros')).toBeTruthy()
    expect(screen.getByTestId('logo-autores')).toBeTruthy()
    expect(screen.getByTestId('logo-salir')).toBeTruthy()
  })

  test("El botón de dashboard dirige al usuario a la ruta correspondiente", async () => {
    renderizarConRouting(footer, '/')

    await userEvent.click(screen.getByTestId('link-dashboard'))
    expect(navegarMock).toBeCalledWith('dashboard')
  })

  test("El botón de libros dirige al usuario a la ruta correspondiente", async () => {
    renderizarConRouting(footer, '/')

    await userEvent.click(screen.getByTestId('link-libros'))
    expect(navegarMock).toBeCalledWith('libros')
  })

  test("El botón de autores dirige al usuario a la ruta correspondiente", async () => {
    renderizarConRouting(footer, '/')

    await userEvent.click(screen.getByTestId('link-autores'))
    expect(navegarMock).toBeCalledWith('autores')
  })
})