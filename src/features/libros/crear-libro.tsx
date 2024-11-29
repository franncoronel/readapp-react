import { createListCollection } from "@chakra-ui/react"
import { useContext, useState } from "react"
import { Libro, validarLibro } from "../../data/domain/libro-domain"
import { useNavigate } from "react-router-dom";
import { libroService } from "@/data/services/libro.service"
import { ErrorResponse, mostrarMensajeError } from "@/data/utils/errores"
import { toaster } from "@/components/ui/toaster"
import { Idioma, lenguajeService } from "../../data/services/Idiomas";
import { useOnInit } from "@/data/hooks/useOnInit"
import { autoresService } from "@/data/services/autor.service"
import { RutaContext } from "@/data/context/ruta-context";
import { Autor } from "@/data/domain/autor-domain";
import FormularioLibro from "./components/formularioLibro";

export const CrearLibro = () => {
    const [libro, setLibro] = useState(
        new Libro(0, '', 0, new Autor(0, '', '', ''), 'tapa-libro.jpg', 0, 0, [], 0, false, false))
    const [autoresCollection, setAutoresCollection] = useState(
        createListCollection<{ label: string; value: string }>({ items: [] })
    )
    const [checkedLecturaCompleja, setCheckedLecturaCompleja] = useState(false)
    const [idiomasSeleccionados, setIdiomasSeleccionados] = useState<Idioma[]>([])
    const [idiomas, setIdiomas] = useState<Idioma[]>([])
    const navegar = useNavigate()
    const { actualizarHeader } = useContext(RutaContext)
    const [ guardando, setGuardando ] = useState(false)

    const inicializacion = async () => {
        actualizarHeader("Agregar Libro")
        obtenerTodosAutores()
        obtenerTodosLenguajes()
      }

    useOnInit(inicializacion)

    const obtenerTodosAutores = () => {
        autoresService.obtenerTodos()
            .then((autores) => {
                const collection = createListCollection({
                    items: autores.data.map((autor) => ({
                        label: `${autor.nombre} ${autor.apellido}`,
                        value: autor.id.toString(),
                    }))
                })
                setAutoresCollection(collection)
            })
            .catch((error) => {
                console.info(error)
                const mensajeError = mostrarMensajeError(error as ErrorResponse)
                mostrarToastError(mensajeError)
            })
    }

    const obtenerTodosLenguajes = () => {
        lenguajeService.obtenerLenguajes().then((idiomas) => {
            setIdiomas(idiomas.data)
            })
            .catch((error) => {
                const mensajeError = mostrarMensajeError(error as ErrorResponse)
                mostrarToastError(mensajeError)
            })
    }

    const obtenerAutorPorId = (id: number) => {
        return autoresService.obtenerPorId(id).then((autor) => autor)
            .catch((error) => {
                const mensajeError = mostrarMensajeError(error as ErrorResponse)
                mostrarToastError(mensajeError)
            })
    }


    const actualizar = (referencia: keyof typeof libro, valor: unknown) => {
        setLibro({
            ...libro,
            [referencia]: valor
        })
    }

    const actualizarAutor = (idAutorString: string) => {
        const idAutor = Number(idAutorString)

        obtenerAutorPorId(idAutor)
            .then((autorSeleccionado) => {
                if (autorSeleccionado) {
                    actualizar('autor', autorSeleccionado.data)
                    setIdiomasSeleccionados([autorSeleccionado.data.lenguaNativa])
                }
            })
            .catch((error) => {
                const mensajeError = mostrarMensajeError(error as ErrorResponse)
                mostrarToastError(mensajeError)
            })
    }

    const seleccionadorIdioma = (seleccion: string) => {
        setIdiomasSeleccionados((prevSeleccion) => {
           if (prevSeleccion.includes(seleccion)) {
            return prevSeleccion.filter((idioma) => idioma !== seleccion)
           } else {
            return [...prevSeleccion, seleccion]
           }
        })
      }

      const regresar = () => {
        navegar("../libros")
      }

    const guardarLibro = () => {
        if (validarLibro(libro)){
            return crearLibro(libro)
        }
        const mensajeError = "Complete todos los campos"
        mostrarToastError(mensajeError)
    }

    const crearLibro = (libro: Libro) => {
        setGuardando(true)
        libro.lecturaCompleja = checkedLecturaCompleja
        libro.idiomas = idiomasSeleccionados
        libroService.agregarLibro(libro)
            .then(() => {
                mostrarToastExito("Libro creado!")
                setTimeout(regresar, 1000)
            })
            .catch((error) => {
                const mensajeError = mostrarMensajeError(error as ErrorResponse)
                mostrarToastError(mensajeError)
                setGuardando(false)
            })
    }

    const cancelarLibro = () => {
        const mensajeError = "Creación cancelada"
        mostrarToastError(mensajeError)
        setTimeout(regresar, 1000)
    }

    return (
            <FormularioLibro
            titulo="Agregar Libro"
            libro={libro}
            autoresCollection={autoresCollection}
            checkedLecturaCompleja={checkedLecturaCompleja}
            idiomasSeleccionados={idiomasSeleccionados}
            idiomas={idiomas}
            actualizar={actualizar}
            actualizarAutor={actualizarAutor}
            seleccionadorIdioma={seleccionadorIdioma}
            guardarLibro={guardarLibro}
            cancelarLibro={cancelarLibro}
            setCheckedLecturaCompleja={setCheckedLecturaCompleja}
            guardando={guardando}
            />
    )}

export default CrearLibro

const mostrarToastError = (mensajeError : string) => {
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
