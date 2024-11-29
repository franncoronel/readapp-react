import { describe, expect, test } from 'vitest'
import TarjetaEstadistica from "./tarjeta-estadistica"
import { render } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'

describe('TarjetaEstadistica', () => {
  const tarjeta = <ChakraProvider value={defaultSystem}><TarjetaEstadistica datoTexto='Recomendaciones' rutaImagen="/medal.svg" datoNumerico={0} /></ChakraProvider>
  test('Tarjeta estadistica se crea sin errores', () => {
    render(tarjeta)
    expect(tarjeta).toBeTruthy()
  })

  //Más adelante habra que agregar test para los botones y las llamadas al back

})