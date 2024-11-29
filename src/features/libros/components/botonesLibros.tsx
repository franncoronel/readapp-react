import { Button } from "@chakra-ui/react"


const BotonesLibro = ({guardarLibro, cancelarLibro, guardando}: BotonesLibroType) => {
    return(
        <>
            <Button
                data-testid="boton-guardar"
                bg="var(--color-primario)"
                color="#FFFFFF"
                _hover={{ bg: "#756ab6", transform: "translateY(-2px)"}}
                padding="0.5rem"
                transition="all 0.3s ease"
                onClick={()=> guardarLibro()}
                disabled={guardando}
            >
                Guardar
            </Button>
            <Button
                data-testid="boton-cancelar"
                bg="var(--color-terciario) "
                _hover={{ bg: "pink.700", transform: "translateY(-2px)"}}
                padding="0.5rem"
                transition="all 0.3s ease"
                onClick={cancelarLibro}
                disabled={guardando}
            >
                Cancelar
            </Button>
        </>
)}

export default BotonesLibro

export type BotonesLibroType = {
    guardarLibro: () => void,
    cancelarLibro: () => void,
    guardando: boolean
}
