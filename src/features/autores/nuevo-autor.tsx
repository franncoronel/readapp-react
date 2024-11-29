import { useContext, useState } from "react";
import { Stack, Input, Button, Heading } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { NativeSelectField, NativeSelectRoot } from "@/components/ui/native-select";
import { autoresService } from "@/data/services/autor.service";
import { Idioma, lenguajeService } from "@/data/services/Idiomas";
import { useNavigate } from "react-router-dom";
import { mostrarMensajeError, ErrorResponse } from "@/data/utils/errores";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useOnInit } from "@/data/hooks/useOnInit";
import { RutaContext } from "@/data/context/ruta-context";
import { Autor, autorPorDefecto } from "@/data/domain/autor-domain";


export const NuevoAutor = () => {
  const [autor, setAutor] = useState<Autor>(autorPorDefecto)
  const [listaDeIdiomas, setIdiomas] = useState<Idioma[]>([])
  const [desabilitarBoton, setDesabilitarBoton] = useState<boolean>(false)
  const navegar = useNavigate()
  const { actualizarHeader } = useContext(RutaContext)


  const cargarValoresIniciales = async () => {
    lenguajeService.obtenerLenguajes().then((idiomas)=>{
      setIdiomas(idiomas.data)
    }).catch((error) => {
      mostrarToastError(mostrarMensajeError(error as ErrorResponse))
      setTimeout(regresar, 1000)
    })
  }

  useOnInit(() => {
    actualizarHeader("Agregar Autor")
    cargarValoresIniciales()
  })

  const guardarAutor = async () => {
    autoresService.nuevo(autor).then(()=>{
      setDesabilitarBoton(true)
      mostrarToastGuardado()
      setTimeout(regresar,1000)
    }).catch((error) => {
      mostrarToastError(mostrarMensajeError(error as ErrorResponse))
    })
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
      title: `Se creo el autor ${autor.nombre} ${autor.apellido}`,
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
  <Stack width="100%" height="100%" p="1rem" marginTop="4rem">
    <Heading as="h2" fontSize="1.5rem">Autor</Heading>
    <Field label="Nombre" required>
      <Input placeholder="nombre" value={autor.nombre} onChange={(event) => actualizar('nombre', event.target.value)} data-testid="autor-nombre"/>
    </Field>
    <Field label="Apellido" required>
      <Input placeholder="apellido" value={autor.apellido} onChange={(event) => actualizar('apellido', event.target.value)} data-testid="autor-apellido"/>
    </Field>
    <Field label="Idioma" required>
      <NativeSelectRoot >
        <NativeSelectField data-testid="autor-lengua" items={listaDeIdiomas} value={autor.lenguaNativa} onChange={(event) => actualizar('lenguaNativa', event.target.value)} />
      </NativeSelectRoot>
    </Field>
    <Button bg="#ac87c5" color="#FFFFFF" alignSelf="flex-end" transition="all 0.3s ease" onClick={guardarAutor} data-testid="boton-guardar"
      _hover={{ bg: "#756ab6", transform: "translateY(-2px)" }}  disabled={desabilitarBoton} >Guardar</Button>
    <Toaster></Toaster>
  </Stack>)
}