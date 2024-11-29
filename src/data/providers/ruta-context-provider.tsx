import { ReactNode, useState } from 'react'
import { RutaContext } from '../context/ruta-context'

/*
  Acá se define el provider, es decir, un componente que le provee el RutaContext
  a todos los componentes hijos, sin importar la profundidad de la anidación.
*/
export const RutaContextProvider = ({ children }: { children: ReactNode }) => {
  const [ruta, setRuta] = useState("")

  const value = {
    ruta,
    actualizarHeader: (nuevaRuta: string) => {
      setRuta(nuevaRuta)
    }
  }

  return (
    <RutaContext.Provider value={value}>
      {children}
    </RutaContext.Provider>
  )
}