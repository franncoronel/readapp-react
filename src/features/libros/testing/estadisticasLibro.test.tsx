import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { mockLibro } from "../../../data/domain/libro-domain";
import EstadisticasLibro from "../components/estadisticaLibro";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

describe("Cuando se renderiza el componente de estadística", () => {
  const actualizarMock = vi.fn();
  const setCheckedLecturaComplejaMock = vi.fn();

  const props = {
    libro: mockLibro,
    checkedLecturaCompleja: false,
    actualizar: actualizarMock,
    setCheckedLecturaCompleja: setCheckedLecturaComplejaMock,
  };
  
  const estadisticas = <ChakraProvider value={defaultSystem}>  <EstadisticasLibro {...props} /> </ChakraProvider>
  
  test("Se renderizan los campos de estadísticas correctamente", () => {
    render(estadisticas);
    expect(screen.getByTestId("ediciones")).toBeTruthy();
    expect(screen.getByTestId("paginas")).toBeTruthy();
    expect(screen.getByTestId("palabras")).toBeTruthy();
    expect(screen.getByTestId("ventas")).toBeTruthy();
    expect(screen.getByTestId("compleja")).toBeTruthy();
  });

  // test("Campo 'Ediciones' actualiza el valor al cambiar", async () => {
  //   render(estadisticas);
    
  //   // Simula un cambio de valor en el campo de Ediciones
  //   const edicionesInput = screen.getByTestId("ediciones");
  //   userEvent.type(edicionesInput, "10");

  //   // Espera que la función 'actualizarMock' haya sido llamada con el valor correcto
  //   expect(actualizarMock).toHaveBeenCalledWith("10");
  // });

  // test("Campo 'Cantidad de páginas' actualiza el valor al cambiar", async () => {
  //   render(estadisticas);
    
  //   // Simula un cambio en el campo de páginas
  //   const paginasInput = screen.getByTestId("paginas");
  //   userEvent.type(paginasInput, "150");

  //   // Verifica que el valor del campo fue actualizado correctamente
  //   expect(actualizarMock).toHaveBeenCalledWith("150");
  // });

  // test("Campo 'Cantidad de palabras' actualiza el valor al cambiar", async () => {
  //   render(estadisticas);
    
  //   // Simula un cambio en el campo de palabras
  //   const palabrasInput = screen.getByTestId("palabras");
  //   userEvent.type(palabrasInput, "2500");

  //   // Verifica que el valor fue actualizado
  //   expect(actualizarMock).toHaveBeenCalledWith("2500");
  // });

  // test("Campo 'Ventas semanales' actualiza el valor al cambiar", async () => {
  //   render(estadisticas);
    
  //   // Simula un cambio en el campo de ventas semanales
  //   const ventasInput = screen.getByTestId("ventas");
  //   userEvent.type(ventasInput, "600");

  //   // Verifica que el valor fue actualizado
  //   expect(actualizarMock).toHaveBeenCalledWith("600");
  // });

  // test("Checkbox 'Lectura Compleja' llama a la función setCheckedLecturaCompleja", async () => {
  //   render(estadisticas);

  //   // Simula el cambio del checkbox
  //   const checkbox = screen.getByTestId("compleja");
  //   userEvent.click(checkbox); // Cambia el estado del checkbox a "checked"
    
  //   // Verifica que se haya llamado a la función con el valor correcto
  //   expect(setCheckedLecturaComplejaMock).toHaveBeenCalledWith(true);
  // });
})