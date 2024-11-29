import { VStack, HStack } from "@chakra-ui/react"
import { Field } from "@/components/ui/field"
import { NumberInputField, NumberInputRoot } from "@/components/ui/number-input"
import { Checkbox } from "@/components/ui/checkbox"
import { Libro } from "../../../data/domain/libro-domain"
import { useState } from "react"

const EstadisticasLibro = ({libro, actualizar, checkedLecturaCompleja, setCheckedLecturaCompleja}: EstadisticaLibroType) => {

    const msgError = "Debe ser mayor a cero"

    const [inputValido, setInputValido] = useState({
        ediciones: false,
        paginas: false,
        palabras: false,
        ventasSemanales: false,
    })

    const validarInput = (value: string) => {
        const input = Number(value)
        return input <= 0
      }    

    const validadorDeInput = (campo: keyof typeof inputValido, value: string) => {
        actualizar(campo, value)
        const estado = validarInput(value) 
        setInputValido((previo) => ({
            ...previo,
            [campo]: estado,
        }))
    }

    return(
        <VStack>
            <Field label="Ediciones" invalid={inputValido.ediciones} errorText={msgError} required>
                <NumberInputRoot 
                    w="100%" 
                    min={0}
                    data-testid="ediciones"
                    value={String(libro.ediciones)}
                    onValueChange={(e) => validadorDeInput('ediciones',e.value)}
                    invalid={inputValido.ediciones}
                >
                <NumberInputField />
                </NumberInputRoot>
            </Field>
            <HStack w="100%">
                <Field label="Cantidad de páginas" invalid={inputValido.paginas} errorText={msgError} required>
                    <NumberInputRoot 
                        w="100%" 
                        min={0}
                        data-testid="paginas"
                        value={String(libro.paginas)}
                        onValueChange={(e) => validadorDeInput('paginas',e.value)}
                        invalid={inputValido.paginas}
                    >
                    <NumberInputField/>
                    </NumberInputRoot>
                </Field>
                <Field label="Cantidad de palabras" invalid={inputValido.palabras} errorText={msgError} required>
                    <NumberInputRoot 
                        w="100%" 
                        min={0}
                        data-testid="palabras"
                        value={String(libro.palabras)}
                        onValueChange={(e) => validadorDeInput('palabras',e.value)}
                        invalid={inputValido.palabras}
                    >
                    <NumberInputField/>
                    </NumberInputRoot>
                </Field>
            </HStack>
            <Field label="Ventas semanales" invalid={inputValido.ventasSemanales} errorText={msgError} required>
                <NumberInputRoot 
                    w="100%" 
                    min={0}
                    data-testid="ventas"
                    value={String(libro.ventasSemanales)}
                    onValueChange={(e) => validadorDeInput('ventasSemanales',e.value)}
                    invalid={inputValido.ventasSemanales}
                >
                <NumberInputField/>
                </NumberInputRoot>
            </Field>
                <Checkbox
                    data-testid="compleja" 
                    marginTop="2"
                    marginLeft="2"
                    checked={checkedLecturaCompleja}
                    onCheckedChange={(e) => setCheckedLecturaCompleja(!!e.checked)}> 
                    Lectura Compleja
                </Checkbox>
        </VStack>
)}

export default EstadisticasLibro

export type EstadisticaLibroType = {
  libro: Libro,
  checkedLecturaCompleja: boolean,
  actualizar: (campo: keyof Libro, valor: unknown) => void,
  setCheckedLecturaCompleja: (checked: boolean) => void 
}
