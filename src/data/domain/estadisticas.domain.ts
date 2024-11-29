export type EstadisticaDTO = {
  entidad: string,
  dato: number
}

export class Estadistica {
  constructor(
    public titulo: string,
    public valor: number,
    public imagenRuta: string
  ) {}

  // Este metodo es el que le da dinamismo y si se quiere cambiar el titulo de la card se hace desde el front y
  // ya no se depende del back.
  private static nombreMap: Record<string, { titulo: string; imagenRuta: string }> = {
    "Recomendaciones": { titulo: "Recomendaciones", imagenRuta: "/medal.svg" },
    "Libros": { titulo: "Libros en Sistema", imagenRuta: "/books-black.svg" },
    "Usuarios": { titulo: "Usuarios totales", imagenRuta: "/users.svg" },
    "Centros": { titulo: "Centros de lectura", imagenRuta: "/storefront.svg" }
  }

  static fromDTO(entidad: string, dato: number): Estadistica {
    const { titulo, imagenRuta } = Estadistica.nombreMap[entidad] || { titulo: entidad, imagenRuta: "" } //Poner una imagen por default, lo que ocurre despues del || lo que ocurriria si desde el back cambian los datos o agregan un dato mas
    return new Estadistica(titulo, dato, imagenRuta)
  }
}

export type InactivosDTO = {
  elementoBorrado: string,
  cantidadBorrado: number
}