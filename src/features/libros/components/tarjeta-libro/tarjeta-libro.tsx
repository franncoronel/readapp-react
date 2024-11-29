import { Libro } from '@/data/domain/libro-domain'
import './libro.css'
import { useNavigate } from 'react-router-dom'
import { Button, ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { BotonConConfirmacion } from '@/components/boton-con-confirmacion/boton-con-confirmacion'

export const TarjetaLibro = ({ libro, onEliminar }: TarjetaLibroType) => {

  const navegar = useNavigate()

  return (

    <ChakraProvider value={defaultSystem}  data-testid="tarjeta-libro">
      <main className="contenedor-libro">
        <figure>
          <div className="auxiliar-centrado"></div>
          <img className="tapa" src={"../" + libro.imagen} alt="Portada del libro" />
          <img className="lapiz" src="/pencil.svg" onClick={() => {navegar(`${libro.id}`)}} />
        </figure>
        <section className="informacion-libro">
          <header>
            <hgroup className="titulo-libro">
              <h1 data-testid="titulo-libro">{libro.titulo}</h1>
              <div className="iconos">
                {libro.bestSeller && <img src='../flame.svg' data-testid="best-seller" alt="Icono de best seller" />}
                {libro.lecturaCompleja && <img src='../certificate.svg' data-testid="desafiante" alt="Icono de desafiante" />}
              </div>
            </hgroup>
            <p className="autor-libro" data-testid="titulo-autor">{libro.autor.nombre + " " + libro.autor.apellido}</p>
          </header>
          <ul>
            <li className="datos-libro" data-testid="titulo-paginas">
              <img src="/paginas.svg" />{libro.paginas} páginas
            </li>
            <li className="datos-libro" data-testid="titulo-palabras">
              <img src="/palabras.svg" />{libro.palabras} palabras
            </li>
            <li className="datos-libro" data-testid="titulo-idiomas" >
              <img src="/idiomas.svg" />{libro.idiomas.join(", ")}
            </li>
            <li className="datos-libro" data-testid="titulo-ventas">
              <img src="/ventas.svg" />{libro.ventasSemanales} ventas semanales
            </li>
          </ul>
          <BotonConConfirmacion mensaje="¿Seguro que quiere borrar este libro?"  accion={onEliminar} textoBoton="Borrar">
            <Button size="xs" variant="ghost" background="none" className="desechar-libro interno" data-testid="boton-eliminar">
              <img src="/trash.svg" alt="Eliminar" />
            </Button>
          </BotonConConfirmacion>
        </section>
      </main>
    </ChakraProvider>
  )
}

export default TarjetaLibro

export type TarjetaLibroType = {
  libro: Libro,
  onEliminar: () => void
}