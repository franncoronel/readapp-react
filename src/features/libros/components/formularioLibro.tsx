import { Libro } from "@/data/domain/libro-domain";
import { Idioma } from "@/data/services/Idiomas";
import { Flex, HStack, Heading, Stack, StackSeparator, ListCollection } from "@chakra-ui/react";
import { Toaster } from "@/components/ui/toaster";
import BotonesLibro from "./botonesLibros";
import EstadisticasLibro from "./estadisticaLibro";
import IdiomaLibro from "./idiomaLibro";
import TituloYAutorLibro from "./tituloYAutorLibro";

const FormularioLibro = ({titulo,
    libro,
    autoresCollection,
    checkedLecturaCompleja,
    idiomasSeleccionados,
    idiomas,
    actualizar,
    actualizarAutor,
    seleccionadorIdioma,
    guardarLibro,
    cancelarLibro,
    setCheckedLecturaCompleja,
    guardando}: FormularioLibroType) => {

    return(
    <>
        <Flex direction="column" marginLeft="2" marginRight="2" marginBottom="3rem" marginTop="3rem" p={1}>
            <HStack>
                <Heading size="2xl">{titulo}</Heading>
            </HStack>
            <Stack separator={<StackSeparator />}>
                <TituloYAutorLibro
                    libro={libro}
                    actualizar={actualizar}
                    actualizarAutor={actualizarAutor}
                    autoresCollection={autoresCollection}
                />
                <EstadisticasLibro
                    libro={libro}
                    actualizar={actualizar}
                    checkedLecturaCompleja={checkedLecturaCompleja}
                    setCheckedLecturaCompleja={setCheckedLecturaCompleja}
                />
                <IdiomaLibro
                    libro={libro}
                    idiomas={idiomas}
                    idiomasSeleccionados={idiomasSeleccionados}
                    seleccionadorIdioma={seleccionadorIdioma}
                />
            </Stack>
            <Flex alignSelf="flex-end" gap={2}>
                <BotonesLibro
                    guardarLibro={guardarLibro}
                    cancelarLibro={cancelarLibro}
                    guardando={guardando}
                />
            </Flex>
        </Flex>
        <Toaster data-testid="mensaje-toaster"></Toaster>
    </>
    )}

export default FormularioLibro

export type FormularioLibroType = {
    titulo: string,
    libro: Libro,
    autoresCollection:  ListCollection<{ label: string; value: string }>,
    checkedLecturaCompleja: boolean,
    idiomasSeleccionados: Idioma[],
    idiomas: Idioma[],
    actualizar: (referencia: keyof Libro, valor: unknown) => void,
    actualizarAutor: (idAutorString: string) => void,
    seleccionadorIdioma: (seleccion: Idioma) => void,
    guardarLibro: () => void,
    cancelarLibro: () => void,
    setCheckedLecturaCompleja: (checked: boolean) => void,
    guardando: boolean
}
