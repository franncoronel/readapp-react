import LupaLogo from '/lupa.svg'
import { Box, Input, Button, Image } from '@chakra-ui/react'
import { FormEvent, useState } from 'react'

export const Buscador = ({ buscar }: { buscar: (busqueda: string) => void }) => {
  const [textoBusqueda, setTextoBusqueda] = useState<string>("")

  const ejecutarBusqueda = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    buscar(textoBusqueda)
  }

  return (
  <form onSubmit={ejecutarBusqueda}>
    <Box
      display="flex"
      flexDirection="row"
      flexWrap="nowrap"
      width="full"
      justifyContent="center">
      <Input
        type="search"
        placeholder="Buscar"
        borderRadius="1rem 0 0 1rem"
        value={textoBusqueda}
        onChange={(event) => setTextoBusqueda(event.target.value)}
        data-testid="barra-busqueda-input"
      ></Input>
      <Button backgroundColor="var(--color-secundario)" borderRadius="0 1rem 1rem 0" type="submit"
        _hover={{ bg: "#756ab6"}}
        transition="all 0.3s ease"
        data-testid="barra-busqueda-boton"
      >
        <Image src={LupaLogo}></Image>
      </Button>
    </Box>
    </form>
  )
}