# Administrador del catalogo

## Acceso

1. Configurar `ADMIN_PASSWORD` en `.env.local` y en las variables de Vercel.
2. Abrir `/admin` e ingresar esa contrasena.

## Persistencia en Vercel

El panel usa Vercel Blob para guardar el catalogo y las imagenes en produccion.

1. En Vercel, abrir el proyecto y entrar a **Storage**.
2. Crear un Blob store con acceso **Public**.
3. Conectarlo al proyecto. Vercel agrega `BLOB_READ_WRITE_TOKEN` automaticamente.
4. Hacer un nuevo deploy.

Sin Blob, el administrador guarda en `.data/catalog.json` y las fotos en
`public/uploads` solamente durante el desarrollo local.

## Limites de imagen

- Formatos: JPG, PNG y WebP.
- Tamano maximo: 4 MB por archivo.
- La primera foto de cada producto se usa como imagen principal.
