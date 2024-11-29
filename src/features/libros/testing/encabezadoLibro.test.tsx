import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { mockLibro } from "../../../data/domain/libro-domain";
import EncabezadoLibro from "../components/EncabezadoLibro";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

describe("Cuandos se renderiza el componente de encabezado", () => {
  
    const encabezado = <ChakraProvider value={defaultSystem}> <EncabezadoLibro libro={mockLibro} /> </ChakraProvider>
  
    test("Se renderiza el icono de best seller cuando es un libro best seller", () => {
      render(encabezado)
      expect(screen.getByTestId("best-seller")).toBeTruthy()
    })
  
    test("Se renderiza el icono de desafiante cuando es una lectura compleja", () => {
      render(encabezado)
      expect(screen.getByTestId("desafiante")).toBeTruthy()
    })
  })
  