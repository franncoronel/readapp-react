import { Heading, Flex, Button, Spinner } from "@chakra-ui/react"
import { TarjetaLibro } from "./components/tarjeta-libro/tarjeta-libro"
import { Libro } from "../../data/domain/libro-domain";
import { Buscador } from "@/components/buscador/buscador"
import { useContext, useState } from "react";
import { libroService } from "@/data/services/libro.service"
import { useOnInit } from "@/data/hooks/useOnInit"
import { Toaster, toaster } from "@/components/ui/toaster";
import { useNavigate } from "react-router-dom";
import { ErrorResponse, mostrarMensajeError } from "@/data/utils/errores"
import { RutaContext } from "@/data/context/ruta-context";

export const NavegarLibros = () => {
  const navegar = useNavigate()
  const [libros, setLibros] = useState<Libro[]>([])
  const { actualizarHeader } = useContext(RutaContext)
  const [ cargando, setCargando ] = useState(false)

  useOnInit(() => {
    actualizarHeader("Libros")
    obtenerLibros()
  })

  const obtenerLibros = async () => {
    setCargando(true)
    libroService.obtenerTodosLibros().then((libros) => {
      setLibros(libros.data.map((libroDTO) => Libro.fromDTO(libroDTO)))}
    ).catch((error) => {
      const mensajeError = mostrarMensajeError(error as ErrorResponse)
      mostrarToastError(mensajeError)
    }).finally(
      () => setCargando(false)
    )
  }


  const eliminarLibro = async (libroEliminado: Libro) => {
    libroService.eliminarLibro(libroEliminado).then(() => {
      obtenerLibros()
      mostrarToastExito(`Se eliminó el libro correctamente!`)
    }
    ).catch((error) => {
      const mensajeError = mostrarMensajeError(error as ErrorResponse)
      mostrarToastError(mensajeError)
    })
  }

  const buscar = async (textoBusqueda: string) => {
    libroService.obtenerPorTexto(textoBusqueda).then((librosBuscados)=>{
      setLibros(librosBuscados.data)
    }).catch((error)=>{
      const mensajeError = mostrarMensajeError(error as ErrorResponse)
      mostrarToastError(mensajeError)
    })
  }

  return (
    <>
      <Flex direction="column" marginLeft="1.5rem" marginRight="1.5rem" marginBottom="4rem" marginTop="4.5rem" paddingBottom="6rem">
        <Heading as="h1" fontSize="2rem"  marginBottom="1rem">Libros</Heading>
        <Buscador buscar={buscar}></Buscador>
        <Flex direction="column" gap="1rem" marginLeft="1.5rem" marginRight="1.5rem" marginBottom="4rem" marginTop="1.5rem">
          {cargando ? (
            <Spinner color="var(--color-terciario)" css={{ "--spinner-track-color": "colors.gray.200" }} animationDuration="0.8s" borderWidth="4px" size="xl" alignSelf="center" justifySelf="center" />
          ) : (
            libros.map((libro) => (
              <TarjetaLibro
                key={libro.id}
                libro={libro}
                onEliminar={() => eliminarLibro(libro)} />
            ))
          )}
        </Flex>


        <Button
          onClick={() => {navegar("crear-libro")}}
          position="fixed"
          bottom="5rem"
          right="2rem"
          width="4rem"
          height="4rem"
          borderRadius="50%"
          bg="var(--color-primario)"
          fontSize="1.5rem"
          color="white"
          zIndex="1000">
          +
        </Button>
      </Flex>
      <Toaster></Toaster>
    </>
  )
}

export default NavegarLibros

const mostrarToastError = (mensajeError: string) => {
  toaster.create({
    title: `${mensajeError}`,
    type: "error",
    duration: 3000,
  })
}

const mostrarToastExito = (mensajeExito: string) => {
  toaster.create({
    title: `${mensajeExito}`,
    type: "success",
    duration: 3000,
  })
}
