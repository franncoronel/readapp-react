import { describe, expect, test, vi } from "vitest";
import { mockLibro } from "../../../data/domain/libro-domain";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TarjetaLibro } from "../components/tarjeta-libro/tarjeta-libro";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

const eliminarMock = vi.fn()

describe ('Cuando se crea una tarjeta de libro', () => {
  const tarjetaLibro =
  <ChakraProvider value={defaultSystem}>
    <MemoryRouter>
        <TarjetaLibro libro={mockLibro} onEliminar={eliminarMock}/>
    </MemoryRouter>
  </ChakraProvider>
  test("Se crea la vista", async () => {
    render(tarjetaLibro)
    expect(tarjetaLibro).toBeTruthy()
  })

  test("Los datos del libro se muestran en la tarjeta", async () => {
    render(tarjetaLibro)
    expect(screen.getByTestId("titulo-libro").textContent).toContain("Titulo")
    expect(screen.getByTestId("titulo-autor").textContent).toContain("nombre apellido")
    expect(screen.getByTestId("titulo-paginas").textContent).toContain("0 páginas")
    expect(screen.getByTestId("titulo-palabras").textContent).toContain("0 palabras")
    expect(screen.getByTestId("titulo-idiomas").textContent).toContain("Español")
    expect(screen.getByTestId("titulo-ventas").textContent).toContain("0 ventas semanales")
  })

  test("El boton de eliminar llama al aviso", async () => {
    render(tarjetaLibro)
    fireEvent.click(screen.getByTestId("boton-eliminar"))
    expect(screen.getByTestId("mensaje-eliminar").textContent).toContain("¿")
  })

  test("El boton de aceptar llama al proceso de eliminar", async () => {
    render(tarjetaLibro)
    fireEvent.click(screen.getByTestId("boton-eliminar"))
    fireEvent.click(screen.getByTestId("aceptar-eliminar"))
    expect(eliminarMock).toHaveBeenCalled()
  })
})