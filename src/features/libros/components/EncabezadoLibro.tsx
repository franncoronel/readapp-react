import { HStack, Image } from "@chakra-ui/react"
import { Libro } from "@/data/domain/libro-domain"

const EncabezadoLibro = ({libro}: EncabezadoLibroType) => 
    <HStack>
      {libro.bestSeller && <Image src='/flame.svg' data-testid="best-seller" alt="Icono de best seller" />}
      {libro.lecturaCompleja && <Image src='/certificate.svg' data-testid="desafiante" alt="Icono de desafiante" />}
    </HStack>

export default EncabezadoLibro

export type EncabezadoLibroType = {
  libro: Libro
}
