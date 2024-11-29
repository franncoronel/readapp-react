import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"

export const renderizarConRouting = (elemento: React.ReactElement, rutaInicial: string) => {
  return (
    render(
      <MemoryRouter initialEntries={[rutaInicial]}>
        {elemento}
      </MemoryRouter>
    )
  )
}