import { Outlet, useNavigate } from "react-router-dom"
import Header from '@/components/header/header'
import Footer from '@/components/footer/footer'
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { useOnInit } from "@/data/hooks/useOnInit"

export default function Layout () {  
  const navegar = useNavigate()

  const evitarAccesoSinLogueo = () => {
    if (!localStorage.getItem('usuario')) { //Creo que hay un guard que hace a esto más elegante
      navegar('/login')
    }
 }
  
  useOnInit(evitarAccesoSinLogueo)
  
    return (
        <ChakraProvider value={defaultSystem} >
        <Header />
        <Outlet />
        <Footer />
      </ChakraProvider>
    )
  }