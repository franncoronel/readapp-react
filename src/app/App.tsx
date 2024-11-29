import { RutaContextProvider } from '@/data/providers/ruta-context-provider'
import { ReadAppRoutes } from '../routes'


function App() {

  return (
    <RutaContextProvider>
      <ReadAppRoutes />
    </RutaContextProvider>
  )
}

export default App