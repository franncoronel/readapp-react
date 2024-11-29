import { useContext, useState } from "react"
import { TarjetaAutor } from "./components/tarjeta-autor"
import { Flex, Stack, Heading, IconButton, Spinner } from "@chakra-ui/react"
import { autoresService } from "@/data/services/autor.service"
import { useOnInit } from "@/data/hooks/useOnInit"
import { useNavigate } from "react-router-dom"
import { Toaster, toaster } from "@/components/ui/toaster"
import { mostrarMensajeError, ErrorResponse } from "@/data/utils/errores"
import { RutaContext } from "@/data/context/ruta-context"
import { Buscador } from "../../components/buscador/buscador"
import { Autor } from "@/data/domain/autor-domain"

export const SeccionAutores = () => {
  const [listaDeAutores, setListaDeAutores] = useState<Autor[]>([])
  const [cargando, setCargando] = useState<boolean>(false)
  const navegar = useNavigate()
  const { actualizarHeader } = useContext(RutaContext)

  const obtenerAutores = async () => {
    setCargando(true)
    autoresService.obtenerTodos().then(
      (autores) => {
        setListaDeAutores(autores.data)
      }
    ).catch((error) => {
      mostrarToastError(mostrarMensajeError(error as ErrorResponse))
    }).finally(
      () => setCargando(false)
    )
  }

  useOnInit(() => {
    actualizarHeader("Autores")
    obtenerAutores()
  })

  useOnInit(obtenerAutores)

  const eliminarAutor = async (autorAEliminar: Autor) => {
    autoresService.eliminar(autorAEliminar).then(() => {
      setListaDeAutores([...listaDeAutores].filter(autor => autorAEliminar != autor))
    }).catch((error) => {
      mostrarToastError(mostrarMensajeError(error as ErrorResponse))
    })
  }

  const buscar = async (textoBusqueda: string) => {
    autoresService.obtenerPorTexto(textoBusqueda).then((autoresBuscados) => {
      setListaDeAutores(autoresBuscados.data)
    }).catch((error) => {
      mostrarToastError(mostrarMensajeError(error as ErrorResponse))
    })
  }

  const mostrarToastError = (mensajeError: string) => {
    toaster.create({
      title: `${mensajeError}`,
      type: "error",
      duration: 7000,
    })
  }

  return (
  <Stack paddingBottom="10rem" marginTop="4.5rem" marginX="1.5rem">
      <Heading as="h1" fontSize="2rem" marginBottom="0.5rem">Autores</Heading>

      <Buscador buscar={buscar}></Buscador>
      {cargando ? (
        <Spinner color="var(--color-terciario)" css={{ "--spinner-track-color": "colors.gray.200" }} animationDuration="0.8s" borderWidth="4px" size="xl" alignSelf="center" justifySelf="center" marginTop="1.5rem"/>
      ) : (
        <Flex wrap="wrap" gap={5} marginTop="1rem">
          {listaDeAutores.map((autor: Autor) => (
            <TarjetaAutor
              autor={autor}
              key={autor.id}
              editar={() => {navegar(`${autor.id}`)}}
              eliminar={eliminarAutor}
              data-testid="tarjeta-autor"
            />
          ))}
        </Flex>
      )}
      <IconButton position="fixed" bottom="5rem" right="2rem" zIndex="1000" w="4rem" h="4rem" alignSelf="center" rounded="full" variant="subtle" bg="var(--color-primario)" color="white" fontSize="1.5rem" onClick={() => navegar('nuevo-autor')}>+</IconButton>
    <Toaster data-testid="mensaje-toaster"></Toaster>
    </Stack>
  )
}