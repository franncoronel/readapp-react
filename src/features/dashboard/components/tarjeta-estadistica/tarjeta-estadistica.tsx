import { Card, Image, Text, Stack } from "@chakra-ui/react"

const TarjetaEstadistica = ({ datoTexto, datoNumerico, rutaImagen }: { datoTexto: string, datoNumerico: number, rutaImagen: string }) => {

  return (
      <Card.Root
        borderColor="var(--color-primario)"
        borderRadius="lg"
        bg="white"
        width="100%"
        height="5.5rem"
        flex="1"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-evenly"
        p="0.5rem"
        marginTop="0.3rem"
        shadow="sm"
        data-testid={`tarjeta-${datoTexto}`}
      >
        <Image src={rutaImagen} width="4rem" />
        <Stack alignItems="center" gap="0" width="70%">
          <Text color="black" textStyle="5xl" fontWeight="bold" data-testid={`texto-${datoNumerico}`}>{datoNumerico}</Text> {/* Cambiar el color a primario */}
          <Text color="black" textStyle="xl" fontWeight="bold" data-testid={`texto-${datoNumerico}`}>{datoTexto}</Text>
        </Stack>
      </Card.Root>
  )
}

export default TarjetaEstadistica