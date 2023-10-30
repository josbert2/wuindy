import { readdirSync, statSync } from "fs";
import path from "path";

export default function getDirectoriesAndFile(dir) {
  // Asegúrate de que no estamos tratando de leer .DS_Store como un directorio
  if (dir === 'documentation/.DS_Store') {
    return null;
  } else {
    return readdirSync(dir)
      .map((file) => {
        const fullPath = path.join(dir, file);
        if (statSync(fullPath).isDirectory()) {
          return getDirectoriesAndFile(fullPath); // Recursivamente obtiene directorios y archivos
        } else if (path.extname(file) === '.mdx') {
          return [dir, file.replace('.mdx', '')]; // Devuelve el directorio y el nombre del archivo sin extensión
        }
        return undefined;
      })
      .filter((item) => item !== undefined); // Filtra elementos undefined resultantes de archivos que no son .mdx
  }
}