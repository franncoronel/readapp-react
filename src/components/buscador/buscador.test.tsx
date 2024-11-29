import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { Buscador } from "./buscador";
import userEvent from "@testing-library/user-event";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

const buscarMock = vi.fn()

describe('Barra de busqueda para autores', () => {
    
    const barraBusqueda = <ChakraProvider value={defaultSystem}> <Buscador buscar={buscarMock} /> </ChakraProvider>
    test("Se crea la vista", () => {
        render(barraBusqueda)
        expect(barraBusqueda).toBeTruthy()
    })

    test("llama a la función buscar al presionar el boton de busqueda", async () => {
        render(barraBusqueda)
        const busquedaInput = await screen.findByTestId("barra-busqueda-input")
        const busquedaBoton = await screen.findByTestId('barra-busqueda-boton')
        const textoTest = 'García Márquez'

        await userEvent.type(busquedaInput, textoTest)
        await userEvent.click(busquedaBoton)

        expect(buscarMock).toHaveBeenCalledWith(textoTest)

    })
})