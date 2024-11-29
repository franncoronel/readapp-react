import { EdicionAutor } from "@/features/autores/edicion-autores"
import { NuevoAutor } from "@/features/autores/nuevo-autor"
import { SeccionAutores } from "@/features/autores/seccion-autores"
import Dashboard from "@/features/dashboard/dashboard"
import CrearLibro from "@/features/libros/crear-libro"
import { EditarLibro } from "@/features/libros/editar-libro"
import { NavegarLibros } from "@/features/libros/navegar-libro"
import { Route, Routes } from "react-router-dom"
import Login from "./features/login/login"
import Layout from "./features/layout/layout"

export const ReadAppRoutes = () =>
  <Routes>
    <Route path="/login" element={<Login/>} />
    <Route path="/my" element={<Layout/>}>
      <Route path="*" element={<Dashboard />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="autores" element={<SeccionAutores />} />
      <Route path="autores/:id" element={<EdicionAutor />} />
      <Route path="autores/nuevo-autor" element={<NuevoAutor />} />
      <Route path="libros" element={<NavegarLibros />} />
      <Route path="libros/:id" element={<EditarLibro />} />
      <Route path="libros/crear-libro" element={<CrearLibro />} />
    </Route>
    <Route path="*" element={<Login />} /> {/*Provisorio para que no rompa*/}
  </Routes>