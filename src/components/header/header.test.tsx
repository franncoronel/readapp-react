import { describe, expect, test } from 'vitest'
import Header from "./header"
import { screen } from '@testing-library/react'
import { renderizarConRouting } from '@/data/utils/render-con-routing'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'

describe("Header", () => {
  const header = <ChakraProvider value={defaultSystem}> <Header/> </ChakraProvider>

  test('Header se crea sin errores', () => {
    renderizarConRouting(header, '/dashboard')
    expect(header).toBeTruthy()
  })

  test("El Header muestra el logo", () => {
    renderizarConRouting(header, '/dashboard')
    expect(screen.getByTestId('logo-ReadApp')).toBeTruthy()
  })
})