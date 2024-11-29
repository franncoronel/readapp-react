import axios from "axios"

const INTERNAL_SERVER_ERROR = 500

export const mostrarMensajeError = (error: ErrorResponse) => {
  const status = error.response?.status
  const mensajeError = status >= INTERNAL_SERVER_ERROR
    ? 'Ocurrió un error. Consulte al administrador del sistema'
    : axios.isAxiosError(error) && !status
      ? 'Ocurrió un error al conectarse al backend. Consulte al administrador del sistema'
      : error.response.data.message
  if (status >= INTERNAL_SERVER_ERROR) {
    console.error(error) //Recordar que el profe dijo que esto no es buena práctica, se usan bibliotecas de manejo de errores
  }
  return mensajeError
}

export type ErrorResponse = {
  response: {
    status: number,
    data: {
      message: string
    }
  }
}

export const ErrorValidacion = (mensaje:string) => {
  return {response: {
    data: {
      message: mensaje
    }
  }}
}