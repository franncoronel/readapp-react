import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { mockLibro } from "../../../data/domain/libro-domain";
import IdiomaLibro from "../components/idiomaLibro";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

describe("Cuando se renderiza el componente de idiomas", () => {
    const seleccionadorIdiomaMock = vi.fn()
  
    const props = {
      libro: mockLibro,
      idiomasSeleccionados: [],
      idiomas: ['Español', 'Inglés', 'Francés'],
      seleccionadorIdioma: seleccionadorIdiomaMock,
    }
  
    const idioma = <ChakraProvider value={defaultSystem}> <IdiomaLibro {...props} /> </ChakraProvider>
  
    test("Se renderiza el lenguaje original del autor", () => {
        render(idioma)
        expect(screen.getByTestId("idioma-original").textContent).toContain('Español')
    })
    
    test("Se renderiza la lista de idiomas", () => {
        render(idioma)
        expect(screen.getByTestId('idioma-lista')).toBeTruthy()
        expect(screen.getAllByText('Español')).toBeTruthy()
        expect(screen.getAllByText('Inglés')).toBeTruthy()
        expect(screen.getAllByText('Francés')).toBeTruthy()
      })

    // test("Se llama a seleccionadorIdioma cuando se selecciona un idioma", () => {
    //     render(idioma)
    //     fireEvent.change(screen.getByText('Inglés'))
    //     expect(seleccionadorIdiomaMock).toHaveBeenCalled()
    //   })
    
  })
  