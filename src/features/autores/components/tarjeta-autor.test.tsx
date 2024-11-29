import { beforeEach, describe, expect, test, vi } from "vitest";
import { TarjetaAutor } from "./tarjeta-autor";
import { fireEvent, render, screen } from "@testing-library/react";
import { Autor } from "@/data/domain/autor-domain";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

const eliminarMock = vi.fn()
const editarMock = vi.fn()
const autor: Autor = new Autor(1, "autor", "autorApellido", "Ruso")

describe('Si la tarjeta es creada', () => {
  const tarjetaAutor = <ChakraProvider value={defaultSystem}>
                        <TarjetaAutor autor={autor} eliminar={eliminarMock} editar={editarMock} />
                      </ChakraProvider>

  test("Muestra los datos del autor", async () => {
    render(tarjetaAutor)
    expect(screen.getByTestId("tarjeta-nombre").textContent).toContain("autor autorApellido")
    expect(screen.getByTestId("tarjeta-lenguaje").textContent).toContain("Ruso")
  })

  test("Si se presiona el boton de editar, se llama a la funcion", async () => {
    render(tarjetaAutor)
    fireEvent.click(screen.getByTestId("boton-editar"))
    expect(editarMock).toHaveBeenCalledWith()
  })

  describe("Si se presiona el boton de eliminar", async () => {
    beforeEach(()=>{
      render(tarjetaAutor)
      fireEvent.click(screen.getByTestId("boton-eliminar"))
    })
    test("Se abre un popup", async () => {
      expect(screen.getByTestId("mensaje-eliminar").textContent).toContain("¿Seguro que quiere borrar este autor?")
    })
    
    test("El boton de aceptar llama al proceso de eliminar", async () => {
      fireEvent.click(screen.getByTestId("aceptar-eliminar"))
      expect(eliminarMock).toHaveBeenCalledWith(autor)
    })
  })
})