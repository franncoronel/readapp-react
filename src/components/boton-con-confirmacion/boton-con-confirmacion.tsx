import { Button } from "@chakra-ui/react"
import { PopoverRoot, PopoverContent, PopoverTrigger, PopoverBody, PopoverTitle } from "@chakra-ui/react/popover"
import { ReactNode, useState } from "react"

type BotonConConfirmacionProps = {
  accion: () => void,
  mensaje: string,
  children: ReactNode
  textoBoton: string
}

export const BotonConConfirmacion = ({ accion, mensaje, children, textoBoton }: BotonConConfirmacionProps) => {
  const [abierto, setAbierto] = useState(false)

  function cerrarTrasEjecutar(accion: () => void) {
    accion()
    setAbierto(false)
  }

  return (<PopoverRoot open={abierto} onOpenChange={(e) => setAbierto(e.open)}>
    <PopoverTrigger asChild>
      {children}
    </PopoverTrigger>
    <PopoverContent bg="black" data-testid="mensaje-eliminar" position="absolute" right="1rem" bottom="3rem" zIndex="5">
      <PopoverBody>
        <PopoverTitle color="white" mb="0.5rem">{mensaje}</PopoverTitle>
        <Button onClick={() => cerrarTrasEjecutar(accion)} variant="outline" color="red" data-testid="aceptar-eliminar">{textoBoton}</Button>
      </PopoverBody>
    </PopoverContent>
  </PopoverRoot>)
}