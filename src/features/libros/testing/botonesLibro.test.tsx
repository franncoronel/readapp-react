import { render, screen, fireEvent } from "@testing-library/react";
import { describe, vi, test, expect } from "vitest";
import BotonesLibro, { BotonesLibroType } from "../components/botonesLibros";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

describe("Cuando se renderiza el componente de botones", () => {
  const guardarMock = vi.fn()
  const cancelarMock = vi.fn()

  const props: BotonesLibroType = {
    guardarLibro: guardarMock,
    cancelarLibro: cancelarMock,
    guardando: false
  }

  const botones = <ChakraProvider value={defaultSystem}><BotonesLibro {...props}></BotonesLibro></ChakraProvider>

  test("Se renderizan los botones 'Guardar' y 'Cancelar'", () => {
    render(botones)
    expect(botones).toBeTruthy()
  })

  test("Al hacer click en el botón 'Guardar' se llama a la función guardarLibro", () => {
    render(botones)
    fireEvent.click(screen.getByTestId("boton-guardar"))
    expect(guardarMock).toHaveBeenCalled()
  })

  test("Al hacer click en el botón 'Cancelar' se llama a la función cancelarLibro", () => {
    render(botones)
    fireEvent.click(screen.getByTestId("boton-cancelar"))
    expect(cancelarMock).toHaveBeenCalled()
  })
})
