import { Card, IconButton, Image } from "@chakra-ui/react"
import LapizLogo from "/pencil.svg"
import BasuraLogo from '/trash.svg'
import { Autor } from "@/data/domain/autor-domain"
import { BotonConConfirmacion } from "@/components/boton-con-confirmacion/boton-con-confirmacion"

export const TarjetaAutor = ({ autor, editar, eliminar }: { autor: Autor, editar: () => void, eliminar: (autor: Autor) => void }) => {
  return (
    <Card.Root bg="white" borderColor="var(--color-primario)" flexDirection="row" width="full" data-testid="tarjeta-autor">
      <Card.Body gap={2}>
        <Card.Title color="black" data-testid="tarjeta-nombre">{autor.nombre} {autor.apellido}</Card.Title>
        <Card.Description data-testid="tarjeta-lenguaje">{autor.lenguaNativa}</Card.Description>
      </Card.Body>
      <Card.Footer gap={2} padding="1rem">
        <IconButton variant="outline" onClick={() => editar()} data-testid="boton-editar">
          <Image src={LapizLogo}></Image>
        </IconButton>
        <BotonConConfirmacion accion={() => eliminar(autor)} mensaje="¿Seguro que quiere borrar este autor?" textoBoton="Borrar">
          <IconButton variant="outline" data-testid="boton-eliminar">
            <Image src={BasuraLogo}></Image>
          </IconButton>
        </BotonConConfirmacion>
      </Card.Footer>
    </Card.Root>
  )
}