import { Usuario } from "@/types";
import { createContext } from "react";

const UsuarioContext = createContext<Usuario | null >(null);

export { UsuarioContext };
