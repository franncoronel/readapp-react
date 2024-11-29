import { Input, Flex, Heading, HStack, Image, Button, Fieldset } from "@chakra-ui/react"
import { Field } from "@/components/ui/field"
import { PasswordInput } from "@/components/ui/password-input"
import { useState } from "react"
import { loginService } from "@/data/services/login.service"
import { useNavigate } from "react-router-dom"
import { Administrador } from "@/data/domain/Administrador.domain"
import { Toaster, toaster } from "@/components/ui/toaster"
import { ErrorResponse, ErrorValidacion, mostrarMensajeError } from "@/data/utils/errores"
import { useOnInit } from "@/data/hooks/useOnInit"

export default function Login() {

  const [datosUsuario, setDatosUsuario] = useState<Administrador>({
    username: '',
    password: '',
    rol: ''
  })

  const [visible, setVisible] = useState(false)

  const manejarCambiosEnInput = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Administrador) => {
    const { value } = e.target
    setDatosUsuario((prevDatos) => ({
      ...prevDatos,
      [field]: value,
    }))
  }

  const navegar = useNavigate()

  const verificacion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    /*
      Una consecuencia de implementar la propieda onSubmit para todo el formulario es que HTML
      tiene un comportamiento por defecto que tenemos que evitar en las SPA.
      Básicamente, crea un pedido HTTP a la URL actual y refresca la página, dos cosas que queremos evitar.
    */
    await loginService.autenticarUsuarioLogueado(datosUsuario)
      .then((usuarioLogeado) => {
        validarRol(usuarioLogeado.data)
        localStorage.setItem('usuario', usuarioLogeado.data)
        irAPrincipal()
      })
      .catch(
        (error) => {
          mostrarToastError(mostrarMensajeError(error as ErrorResponse))
        }
      )
  }

  const validarRol = (usuarioLogueado: Administrador) => {
    if (usuarioLogueado.rol != "ADMINISTRADOR") {
      throw ErrorValidacion("No tiene permisos para acceder")
    }
  }

  const mostrarToastError = (mensajeError: string) => {
    toaster.create({
      title: `${mensajeError}`,
      type: "error",
      duration: 7000,
    })
  }
  const irAPrincipal = () => {
    navegar('/my/dashboard') // chequear
  }

  const accederSiLoguado = () => {
    if (localStorage.getItem('usuario')) { //Creo que hay un guard que hace a esto más elegante
      irAPrincipal()
    }
  }

  useOnInit(accederSiLoguado)

  return (
    <Flex h="100%" w="100%" p="3rem" direction="column" justifyContent="center" gap="2rem" bg="linear-gradient(var(--color-terciario), var(--color-secundario))">
      <HStack justifyContent="center">
        <Image src="logo-login.svg" height="4rem" width="4rem"></Image>
        <Heading size="5xl">ReadApp</Heading>
      </HStack>

      <form onSubmit={verificacion}>
        <Fieldset.Root gap="0.5rem">
          <Fieldset.Content>
            <Field label="Usuario" required>
              <Input
                data-testid="usuario-input"
          colorPalette="var(--color-cuaternario)"
                bg="var(--color-cuaternario)"
                color="black"
                value={datosUsuario.username}
                onChange={(e) => manejarCambiosEnInput(e, 'username')}
                placeholder="Ingresa tu username aquí..."
                required
              />
            </Field>
            <Field label="Contraseña" required>
              <PasswordInput
                data-testid="password-input"
          bg="var(--color-cuaternario)"
                visible={visible}
                onVisibleChange={setVisible}
                value={datosUsuario.password}
                onChange={(e) => manejarCambiosEnInput(e, 'password')}
                placeholder="Ingresa tu contraseña aquí..."
                required
              />
            </Field>
          </Fieldset.Content>

          <Button type='submit' variant='solid' bg="#756ab6" color="white" data-testid="boton-login">
            Ingresar
          </Button>
        </Fieldset.Root>
      </form>
      <Toaster></Toaster>
    </Flex>
  )
}