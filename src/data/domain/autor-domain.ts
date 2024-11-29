import { ErrorValidacion } from "@/data/utils/errores"
import { Idioma } from "../services/Idiomas"

export class Autor {
  constructor(
    public id: number,
    public nombre: string,
    public apellido: string,
    public lenguaNativa: Idioma
  ) {}

  static fromDTO(autorDTO: AutorDTO): Autor {
    return Object.assign(
      new Autor(
        autorDTO.id,
        autorDTO.nombre,
        autorDTO.apellido,
        autorDTO.lenguaNativa      
      )
    )
  }

  static toDTO(autorDTO: AutorDTO): AutorDTO{
    return Object.assign(
      new AutorDTO(
      autorDTO.id,
      autorDTO.nombre,
      autorDTO.apellido,
      autorDTO.lenguaNativa 
    ))
  }

}

export class AutorDTO {
  constructor(
    public id: number,
    public nombre: string,
    public apellido: string,
    public lenguaNativa: string 
  ){}
  
}

export const autorPorDefecto: Autor = new Autor(0, "", "", "Español")

export const validar = (autor: Autor) => {
  if(!autor.nombre) {
    throw ErrorValidacion("Debe agregar un nombre")
  }
  if(!autor.apellido) {
    throw ErrorValidacion("Debe agregar un apellido")
  }
  if(!autor.lenguaNativa) {
    throw ErrorValidacion("Debe agregar un idioma valido como lengua nativa")
  }
}