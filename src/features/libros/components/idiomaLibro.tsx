import { Text, Heading, Grid, GridItem, Box } from "@chakra-ui/react"
import { Checkbox } from "@/components/ui/checkbox"
import { Libro } from "@/data/domain/libro-domain"
import { Idioma } from "@/data/services/Idiomas"

const IdiomaLibro = ({libro, idiomasSeleccionados, idiomas, seleccionadorIdioma}: IdiomaLibroType) =>
      <section>
        <Text data-testid="idioma-original"><strong>Lenguaje Original:</strong> {libro.autor.lenguaNativa || 'Seleccione un autor'}</Text>
        <Heading marginTop="1rem" size="md">Otros idiomas</Heading>
          <Box overflowY="auto" p={4} maxHeight="7rem">          
            <Grid templateColumns="repeat(3, 1fr)" data-testid="idioma-lista">
                {idiomas.map((idioma) => (
                <GridItem key={idioma}  >
                    <Checkbox
                          value={idioma}
                          checked={idiomasSeleccionados.includes(idioma)}
                          onCheckedChange={() => seleccionadorIdioma(idioma)}> 
                          {idioma}
                    </Checkbox>
                </GridItem>
                ))}
            </Grid>     
          </Box>
      </section>

export default IdiomaLibro

export type IdiomaLibroType = {
  libro: Libro, 
  idiomasSeleccionados: Idioma[], 
  idiomas: Idioma[], 
  seleccionadorIdioma: (seleccion: string) => void
}
