import { Image, HStack, Link } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { BotonConConfirmacion } from "@/components/boton-con-confirmacion/boton-con-confirmacion"

const Footer = () => {
  const navegar = useNavigate()

  const logout = () => {
    localStorage.removeItem("usuario")
    navegar('/login')
  }

  return (
      <HStack
        bg="var(--color-primario)"
        w="100%"
        p="0.5em 1em"
        justifyContent="space-between"
        h="3.5rem"
        boxShadow="md"
        position="fixed"
        bottom="0"
        left="0"
        zIndex="1000"
        data-testid="footer"
      >
        <Link onClick={() => {navegar('dashboard')}} data-testid="link-dashboard">
          <Image src="/speedometer.svg" data-testid="logo-dashboard"></Image>
        </Link>
        <Link onClick={() => {navegar('libros')}} data-testid="link-libros">
          <Image src="/books-white.svg" data-testid="logo-libros"></Image>
        </Link>
        <Link onClick={() => {navegar('autores')}} data-testid="link-autores">
          <Image src="/user-square.svg" data-testid="logo-autores"></Image>
        </Link>
        <BotonConConfirmacion accion={logout} mensaje="¿Seguro que quiere salir de su cuenta?" textoBoton="Cerrar sesión">
        <a>
          <Image src="/sign-out.svg" data-testid="logo-salir"></Image>
        </a>
        </BotonConConfirmacion>
      </HStack>
  )
}

export default Footer
