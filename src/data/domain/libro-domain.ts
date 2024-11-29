import { Idioma } from "../services/Idiomas"
import { Autor } from "./autor-domain"

export class Libro {
  constructor(
    public id: number,
    public titulo: string,
    public ediciones: number,
    public autor: Autor,
    public imagen: string,
    public paginas: number,
    public palabras: number,
    public idiomas: Idioma[],
    public ventasSemanales: number,
    public bestSeller: boolean,
    public lecturaCompleja: boolean
  ) {}
  
  static fromDTO(libroDTO: LibroDTO): Libro {
    return Object.assign(
      new Libro(
        libroDTO.id,
        libroDTO.titulo,
        libroDTO.ediciones,
        Autor.fromDTO(libroDTO.autor),
        libroDTO.imagen,
        libroDTO.paginas,
        libroDTO.palabras,
        libroDTO.idiomas,
        libroDTO.ventasSemanales,
        libroDTO.bestSeller,
        libroDTO.desafiante        
      )
    )
  }

  static toDTO(libro: Libro): LibroDTO{
    return Object.assign(
      new LibroDTO(
      libro.id,
      libro.titulo,
      libro.ediciones,
      Autor.toDTO(libro.autor),
      libro.imagen,
      libro.paginas,
      libro.palabras,
      libro.idiomas,
      libro.ventasSemanales,
      libro.bestSeller,
      libro.lecturaCompleja
    ))
  }
}
export class LibroDTO {
  constructor(
    public id: number,
    public titulo: string,
    public ediciones: number,
    public autor: Autor,
    public imagen: string,
    public paginas: number,
    public palabras: number,
    public idiomas: Idioma[],
    public ventasSemanales: number,
    public bestSeller: boolean,
    public desafiante: boolean,
  ){}
  
}

export class LibroActualizado {
  constructor(
    public titulo: string,
    public autor: Autor,
    public ediciones: number,
    public paginas: number,
    public ventasSemanales: number,
    public lecturaCompleja: boolean,
    public idiomas: Idioma[]
  ) {}
}


export function validarLibro(libro: Libro): boolean {
  return (
      libro.titulo.trim() !== '' &&
      libro.autor !== null &&
      libro.ediciones > 0 &&
      libro.paginas > 0 &&
      libro.palabras > 0
  )
}
  
export function actualizarLibro(libro: Libro, libroActualizados: LibroActualizado): Libro{
  return new Libro(
    libro.id,
    libroActualizados.titulo ?? libro.titulo,
    libroActualizados.ediciones ?? libro.ediciones,
    libroActualizados.autor ?? libro.autor,
    libro.imagen,
    libroActualizados.paginas ?? libro.paginas,
    libro.palabras,
    libroActualizados.idiomas ?? libro.idiomas,
    libroActualizados.ventasSemanales ?? libro.ventasSemanales,
    libro.bestSeller,
    libroActualizados.lecturaCompleja ?? libro.lecturaCompleja
  )
}

export const mockLibro: Libro = new Libro(0, 'Titulo', 0, new Autor(0, 'nombre', 'apellido', 'Español'), 'tapa-libro.jpg', 0, 0, ['Español'], 0, true, true)
export const mockEditado: Libro = new Libro(0, 'TituloEditado', 0, new Autor(0, 'nombre', 'apellido', 'Español'), 'tapa-libro.jpg', 0, 0, ['Español'], 0, true, true)
export const mockListaLibros: Libro[] = [mockLibro,mockEditado]
