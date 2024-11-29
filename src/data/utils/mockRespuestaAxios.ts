import { AxiosHeaders } from "axios"

//Sirve para construir una respuesta de Axios, le pasas el contenido del tipo data que esperas que venga y un numero de estado
//Tambien sirve para simular errores de axios, por eso posee tambien un response.data.message
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const axiosResponseMockContructor = (status: number, contenido : any) => {
    return {
      status: status,
      data: contenido,
      statusText: "",
      headers: new AxiosHeaders,
      config: {
        headers: new AxiosHeaders
      },
      response: {
        data: {
          message: contenido
        }
      }
    }
  }