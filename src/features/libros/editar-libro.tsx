import { useContext, useState } from "react"
import { Libro, validarLibro } from "../../data/domain/libro-domain"
import { useNavigate, useParams } from "react-router-dom"
import { useOnInit } from "@/data/hooks/useOnInit"
import { libroService } from "@/data/services/libro.service"
import { toaster } from "@/components/ui/toaster";
import { createListCollection } from "@chakra-ui/react"
import { Idioma, lenguajeService } from "../../data/services/Idiomas"
import { mostrarMensajeError, ErrorResponse } from "@/data/utils/errores"
import { autoresService } from "@/data/services/autor.service"
import { RutaContext } from "@/data/context/ruta-context"
import { Autor } from "@/data/domain/autor-domain"
import FormularioLibro from "./components/formularioLibro"

export const EditarLibro = () => {

    const [libro, setLibro] = useState(
        new Libro(0, '', 0, new Autor(0, '', '', ''), 'tapa-libro.jpg', 0, 0, [], 0, false, false))
    const [autoresCollection, setAutoresCollection] = useState(
        createListCollection<{ label: string; value: string }>({ items: [] })
    )
    const [checkedLecturaCompleja, setCheckedLecturaCompleja] = useState(false)
    const [idiomasSeleccionados, setIdiomasSeleccionados] = useState<Idioma[]>([])
    const [idiomas, setIdiomas] = useState<Idioma[]>([])

    const navegar = useNavigate()
    const {id} = useParams<{ id: string }>()
    const libroId = Number(id)
    const { actualizarHeader } = useContext(RutaContext)
    const [ guardando, setGuardando ] = useState(false)

    const inicializacion = () => {
        actualizarHeader("Editar Libro")
        obtenerTodosLenguajes()
            .then(() => {
                return obtenerLibroPorId()
            })
            .catch((error) => {
                const mensajeError = mostrarMensajeError(error as ErrorResponse)
                mostrarToastError(mensajeError)
            })
    }

    useOnInit(inicializacion)

    const obtenerLibroPorId = () => {
        obtenerTodosAutores()
        libroService.obtenerLibroPorId(libroId).then((libroObtenido) => {
            const libro = Libro.fromDTO(libroObtenido.data)
            setLibro(libro)
            setCheckedLecturaCompleja(libro.lecturaCompleja)
            setIdiomasSeleccionados(libro.idiomas)
            })
            .catch((error) => {
                mostrarToastError(mostrarMensajeError(error as ErrorResponse))
            })
    }

    const obtenerTodosAutores = () => {
        autoresService.obtenerTodos()
            .then((autores) => {
                const collection = createListCollection({
                    items: autores.data.map((autor) => ({
                        label: `${autor.nombre} ${autor.apellido}`,
                        value: autor.id.toString(),
                    })),
                })
                setAutoresCollection(collection)
            })
            .catch((error) => {
                const mensajeError = mostrarMensajeError(error as ErrorResponse)
                mostrarToastError(mensajeError)
            })
    }

    const obtenerTodosLenguajes = () => {
        return lenguajeService.obtenerLenguajes()
            .then((idiomas) => {
                setIdiomas(idiomas.data)
            })
            .catch((error) => {
                const mensajeError = mostrarMensajeError(error as ErrorResponse)
                mostrarToastError(mensajeError)
            })
    }

    const obtenerAutorPorId = (id: number) => {
        return autoresService.obtenerPorId(id)
            .then((autor) => autor)
            .catch((error) => {
                const mensajeError = mostrarMensajeError(error as ErrorResponse)
                mostrarToastError(mensajeError)
            })
    }

    const actualizarAutor = (idAutorString: string) => {
        const idAutor = Number(idAutorString)
        obtenerAutorPorId(idAutor)
            .then((autorSeleccionado) => {
                console.log(autorSeleccionado)
                if (autorSeleccionado) {
                    actualizar('autor', autorSeleccionado.data)
                    seleccionadorIdioma(autorSeleccionado.data.lenguaNativa)
                }
            })
            .catch((error) => {
                const mensajeError = mostrarMensajeError(error as ErrorResponse)
                mostrarToastError(mensajeError)
            })
    }

    const manejarLecturaCompleja = (valor: boolean) => {
        setCheckedLecturaCompleja(valor);
        setLibro((prevLibro) => ({ ...prevLibro, lecturaCompleja: valor }));
    }

    const seleccionadorIdioma = (seleccion: Idioma) => {
        if (idiomasSeleccionados.includes(seleccion)) {
          setIdiomasSeleccionados((prev) => prev.filter((idioma) => idioma !== seleccion))
        } else {
          setIdiomasSeleccionados((prev) => [...prev, seleccion])
        }
      };


    const actualizar = (referencia: keyof Libro, valor: unknown) => {
        if (libro) {
            setLibro({
                ...libro,
                [referencia]: valor
            })
        }
    }

    const regresar = () => {
        navegar("../libros")
      }

    const guardarLibro = () => {
        setGuardando(true)
        libro.idiomas = idiomasSeleccionados
        if (validarLibro(libro)) {
            libroService.actualizarLibro(libro)
                .then(() => {
                    mostrarToastExito("Libro editado exitosamente!")
                    setTimeout(regresar, 1000)
                })
                .catch((error) => {
                    const mensajeError = mostrarMensajeError(error as ErrorResponse)
                    mostrarToastError(mensajeError)
                    setGuardando(false)
                })
        } else {
            setGuardando(false)
            const mensajeError = "No pueden quedar campos vacíos"
            mostrarToastError(mensajeError)
        }
    }

    const cancelarLibro = () => {
        const mensajeError = "Edición cancelada"
        mostrarToastError(mensajeError)
        setTimeout(regresar, 1000)
    }

    return (
            <FormularioLibro
            titulo="Editar Libro"
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
            setCheckedLecturaCompleja={manejarLecturaCompleja}
            guardando={guardando}
            />
)}

export default EditarLibro

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