import { Box, Text, Image } from "@chakra-ui/react"
import { useContext } from "react"
import { RutaContext } from "@/data/context/ruta-context"

const Header = () => {
  const { ruta } = useContext(RutaContext)

  return (
      <Box bg="var(--color-primario)" display="flex" h="3.5rem" p="0.5rem" w="100%" position="fixed" top="0" zIndex="1000">
        <Text
          display="flex"
          alignItems="center"
          color="white"
          fontWeight="bold"
          fontSize="1.2rem"
          data-testid="titulo-header"
        >
          <Image src="/book.svg" data-testid="logo-ReadApp" />
          ReadApp / {ruta}
        </Text>
      </Box>
  )
}

export default Header
