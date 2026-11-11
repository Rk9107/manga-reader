# Manga Reader

Lector web personal para archivos CBZ/ZIP, CBR/RAR e imágenes. Publicar como sitio estático en GitHub Pages.

## Publicación
1. Subir todos los archivos de esta carpeta a la raíz del repositorio.
2. En Settings > Pages, elegir Deploy from a branch, `main` y `/(root)`.
3. Guardar y esperar a que GitHub Pages publique el sitio.

No subir archivos de manga al repositorio público. Los archivos se importan desde el dispositivo del lector.

El soporte CBR utiliza libarchive.js (WASM) cargado desde CDN al importar un archivo; requiere conexión a internet para descargar el motor la primera vez. CBZ utiliza JSZip desde CDN. La biblioteca usa almacenamiento del navegador; los archivos grandes pueden exceder la cuota local.
