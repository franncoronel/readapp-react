import { useContext, useState } from "react"
import { Stack, Input, Button, Flex, Heading, NativeSelectRoot } from "@chakra-ui/react"
import { autoresService } from "@/data/services/autor.service"
import { useOnInit } from "@/data/hooks/useOnInit"
import { useNavigate, useParams } from "react-router-dom"
import { Idioma, lenguajeService } from "@/data/services/Idiomas"
import { ErrorResponse, mostrarMensajeError } from "@/data/utils/errores"
import { RutaContext } from "@/data/context/ruta-context"
import { autorPorDefecto } from "@/data/domain/autor-domain"
import { Toaster, toaster } from "@/components/ui/toaster"
import { Field } from "@/components/ui/field"
import { NativeSelectField } from "@/components/ui/native-select"

export const EdicionAutor = () => {
  const [autor, setAutor] = useState(autorPorDefecto)
  const [listaDeIdiomas, setIdiomas] = useState<Idioma[]>([])
  const [desabilitarBoton, setDesabilitarBoton] = useState<boolean>(false)
  const navegar = useNavigate()
  const { id } = useParams()
  const { actualizarHeader } = useContext(RutaContext)

  const cargarAutor = async () => {
    lenguajeService.obtenerLenguajes().then((idiomas)=>{
      setIdiomas(idiomas.data)
    }).catch((error) => {
      mostrarToastError(mostrarMensajeError(error as ErrorResponse))
    })

    autoresService.obtenerPorId(Number(id)).then((autorCargado)=>{
      setAutor(autorCargado.data)
    }).catch((error) => {
      mostrarToastError(mostrarMensajeError(error as ErrorResponse))
      setTimeout(regresar, 1000)
    })
  }

  useOnInit(() => {
    actualizarHeader("Editar Autor")
    cargarAutor()
  })


  const guardarAutor = async () => {
    autoresService.guardar(autor).then(()=>{
      setDesabilitarBoton(true)
      mostrarToastGuardado()
      setTimeout(regresar, 1000)}
    ).catch (error => {
      mostrarToastError(mostrarMensajeError(error as ErrorResponse))
    })
    }

  const cancelarCambios = () => {
    cargarAutor()
    setTimeout(regresar, 1000)
  }

  const regresar = () => {
    navegar("../autores")
  }

  const actualizar = (referencia: keyof typeof autor, valor: unknown) => {
    setAutor({
      ...autor,
      [referencia]: valor
    })
  }

  const mostrarToastGuardado = () => {
    toaster.create({
      title: `Autor ${autor.nombre} ${autor.apellido} actualizado con exito`,
      type: "success",
      duration: 3000,
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
  <Stack p="1rem" marginTop="4rem">
    <Heading as="h2" fontSize="1.5rem">Autor</Heading>
    <Field label="Nombre" required invalid={!autor.nombre} errorText="Debe agregar un nombre">
      <Input placeholder="nombre" value={autor.nombre} onChange={(event) => actualizar('nombre', event.target.value)} data-testid="autor-nombre" />
    </Field>
    <Field label="Apellido" required invalid={!autor.apellido} errorText="Debe agregar un apellido">
      <Input placeholder="apellido" value={autor.apellido} onChange={(event) => actualizar('apellido', event.target.value)} data-testid="autor-apellido" />
    </Field>
    <Field label="Idioma" required invalid={!autor.lenguaNativa} errorText="Debe agregar una lengua">
      <NativeSelectRoot >
        <NativeSelectField items={listaDeIdiomas} value={autor.lenguaNativa} onChange={(event) => actualizar('lenguaNativa', event.target.value)} data-testid="autor-lengua" />
      </NativeSelectRoot>
    </Field>
    <Flex alignSelf="flex-end" gap={2}>
      <Button bg="#ac87c5" color="#FFFFFF" _hover={{ bg: "#756ab6", transform: "translateY(-2px)" }} padding="0.5rem" data-testid="boton-guardar"
        transition="all 0.3s ease" onClick={guardarAutor} disabled={desabilitarBoton} >Guardar</Button>
      <Button bg="#e0aed0 " _hover={{ bg: "pink.700", transform: "translateY(-2px)" }} padding="0.5rem"
        transition="all 0.3s ease" onClick={cancelarCambios} >Cancelar</Button>
    </Flex>
    <Toaster data-testid="mensaje-toaster"></Toaster>
  </Stack>)
}