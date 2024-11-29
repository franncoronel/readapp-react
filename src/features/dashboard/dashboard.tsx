import { Button, Group, Heading, Separator, Spinner, Stack, VStack } from "@chakra-ui/react"
import TarjetaEstadistica from "./components/tarjeta-estadistica/tarjeta-estadistica"
import { useContext, useState } from "react"
import { useOnInit } from "@/data/hooks/useOnInit"
import { dashboardService } from "@/data/services/dashboard.service"
import { Toaster, toaster } from "@/components/ui/toaster"
import { ErrorResponse, mostrarMensajeError } from "@/data/utils/errores"
import { Estadistica } from "@/data/domain/estadisticas.domain"
import { RutaContext } from "@/data/context/ruta-context"
import { BotonConConfirmacion } from "@/components/boton-con-confirmacion/boton-con-confirmacion"

export const Dashboard = () => {
  const [datosNumericos, setDatosNumericos] = useState<Estadistica[]>([])
  const { actualizarHeader } = useContext(RutaContext)
  const [cargando, setCargando] = useState<boolean>(false)

  const obtenerDatos = async () => {
    setCargando(true)
    dashboardService.obtenerEstadisticas().then(
      (datos) => {
        const datosEstadisticos = datos.data.map((estadistica) => Estadistica.fromDTO(estadistica.entidad, +estadistica.dato))
        setDatosNumericos(datosEstadisticos)
      }
    ).catch((error) => {
      mostrarToastError(mostrarMensajeError(error as ErrorResponse))
    }).finally(
      () => setCargando(false)
    )
  }

  useOnInit(() => {
    actualizarHeader("Dashboard")
    obtenerDatos()
  })

  const borrarUsuariosInactivos = async () => {
    dashboardService.borrarUsuariosInactivos().then(
      (borrados) => {
        mostrarToastNotificacion(+borrados.data.cantidadBorrado, "usuarios")
        obtenerDatos()
      }
    ).catch((error) => {
      mostrarToastError(mostrarMensajeError(error as ErrorResponse))
    })
  }

  const borrarCentrosInactivos = async () => {
    dashboardService.borrarCentrosInactivos().then(
      (borrados) => {
        mostrarToastNotificacion(borrados.data.cantidadBorrado, "centros de lectura")
        obtenerDatos()
      }
    ).catch((error) => {
      mostrarToastError(mostrarMensajeError(error as ErrorResponse))
    })
  }

  const mostrarToastNotificacion = (borrados: number, elementoBorrado: string) => {
    toaster.create({
      title: `Fueron eliminados ${borrados} ${elementoBorrado}`,
      description: "Esta acción es irreversible.",
      type: "success",
      duration: 5000,
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
      <Stack
        bg="white"
        marginX="1.5rem"
        paddingBottom="4rem"
        marginTop="4.5rem"
        gap={{base:"1rem", md:"1.5rem"}}
      >
        <Heading as="h1" fontSize="2rem" data-testid="titulo-principal">Indicadores</Heading>

        {cargando ? (
          <Spinner color="var(--color-terciario)" css={{ "--spinner-track-color": "colors.gray.200" }} animationDuration="0.8s" borderWidth="4px" size="xl" alignSelf="center" justifySelf="center" />
        ) : (
          <VStack data-testid="contenedor-tarjetas">
            {datosNumericos.map((estadistica) => (
              <TarjetaEstadistica
                key={estadistica.valor} //reever esto
                datoTexto={estadistica.titulo}
                datoNumerico={estadistica.valor}
                rutaImagen={estadistica.imagenRuta}
              />
            ))}
          </VStack>
        )}


        <Separator borderColor="#756ab6" marginTop="0.5rem" />

        <Heading
          as="h2"
          color="black"
          fontWeight="bold"
          fontSize="1.5rem"
          alignSelf="flex-start"
          data-testid="titulo-secundario"
        >
          Acciones
        </Heading>

        <Group flexDirection="column" gap="1rem">
        <BotonConConfirmacion mensaje="¿Seguro que quiere borrar los centros inactivos?" accion={borrarCentrosInactivos} textoBoton="Borrar" data-testid="confirmacion-centros">
          <Button width="100%" variant="solid" bg="#756ab6" color="white" data-testid="boton-centros">Borrar centros inactivos</Button>
        </BotonConConfirmacion>

        <BotonConConfirmacion mensaje="¿Seguro que quiere borrar los usuarios inactivos?" accion={borrarUsuariosInactivos} textoBoton="Borrar" data-testid="confirmacion-usuarios">
          <Button width="100%" variant="solid" bg="#756ab6" color="white" data-testid="boton-usuarios">Borrar usuarios inactivos</Button>
        </BotonConConfirmacion>
        </Group>
        <Toaster></Toaster>

      </Stack>
  )
}
export default Dashboard
