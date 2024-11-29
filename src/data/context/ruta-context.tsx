import { createContext } from 'react'

//Se define un tipo, creo que porque había que tipar tanto ruta como la función setRuta apropiadamente.
export type RutaContextType = {
  ruta: string
  actualizarHeader: (ruta: string) => void
}
//Se crea el contexto con valores por defecto.
export const RutaContext = createContext<RutaContextType>({
  ruta: "",
  actualizarHeader: () => { }
})