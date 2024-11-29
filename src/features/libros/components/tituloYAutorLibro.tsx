import { Field } from "@/components/ui/field"
import { Input, ListCollection, SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from "@chakra-ui/react"
import { Libro } from "../../../data/domain/libro-domain"
import { useState } from "react"

const TituloYAutorLibro = ( {libro, autoresCollection, actualizar, actualizarAutor} : TituloYAutorType) => {


  const autorActual = autoresCollection.items.find(
    (autor) => Number(autor.value) === libro.autor.id
  )

  const [inputValido, setInputValido] = useState({
    titulo: false,
    autor: false,
  })

  const validarInput = (campo: keyof typeof inputValido, value: string | undefined) => {
    if (campo === 'titulo') {
      return value?.trim() === '' 
    }
    if (campo === 'autor') {
      return value === undefined 
    }
    return false
  }

  const validadorDeInput = (campo: keyof typeof inputValido, value: string | undefined) => {
    const invalido = validarInput(campo, value) 
    setInputValido((previo) => ({
      ...previo,
      [campo]: invalido,
    }))
  }
  
  return(
    <>
      <Field label="Título" required invalid={inputValido.titulo} errorText="El título es obligatorio">
        <Input 
          placeholder="Ingrese el título"
          value= {libro.titulo}
          onChange={(e) => { 
            actualizar('titulo',e.target.value)
            validadorDeInput('titulo',e.target.value)
          }}
        />
      </Field>

      <section>
        <Field label="Autor" invalid={inputValido.autor} errorText="Debe seleccionar un autor" required> 
          <SelectRoot
            collection={autoresCollection}
            value={autorActual? [autorActual.value]: undefined} 
            onValueChange={(autor) => {
              actualizarAutor(autor.value[0])
              validadorDeInput('autor', autor.value[0])
              }}
            >
              <SelectTrigger>
                <SelectValueText placeholder="Selecciona un autor"/>
              </SelectTrigger>
              <SelectContent
                borderRadius="1rem" 
                backgroundColor="transparent" 
                boxShadow="none"
                maxHeight="9rem"
                overflowY='auto'>
                {autoresCollection.items.map((autor) => (
                <SelectItem
                  background="white"
                  border=".5px solid gray"
                  _hover={{ backgroundColor: "var(--color-secundario)" }}
                  item={autor} 
                  key={autor.value}>
                  {autor.label}
                </SelectItem>
                ))}
              </SelectContent>
          </SelectRoot>
        </Field>
      </section>
    </>
)}
export default TituloYAutorLibro

export type TituloYAutorType = { 
  libro: Libro, 
  autoresCollection: ListCollection<{ label: string; value: string }>,
  actualizar: (campo: keyof Libro, valor: unknown) => void,
  actualizarAutor: (valor: string) => void,
}