# Kioma Sport — Proyecto final

Pequeño proyecto de ejemplo: backend en Node.js + Express (modular por dominio) y frontend con Vite + React.

## 🧭 Estructura
- `backend/` — API REST (ESM, Sequelize, SQLite por defecto)
- `frontend/` — App React (Vite)

## 🚀 Arrancar localmente

1. Backend

Este directorio contiene la API (Node.js + Express + Sequelize). Para detalles generales del proyecto, consulta el `README.md` en la raíz del repositorio.

Comandos básicos:

```cmd
cd backend
npm install
cp .env.example .env   # ajustar si es necesario
npm run dev
```

Ejecutar tests:

```cmd
npm test
```

Notas:
- La API corre por defecto en `http://localhost:4000/api/v1`.
- Endpoints de interés: `/auth/*`, `/clients`, `/products`, `/sales`, `/cart`.

2. Frontend

```cmd
cd frontend
npm install
cp .env.example .env   # ajustar VITE_API_URL si tu backend usa otro puerto
npm run dev
```

## 🧪 Tests
- Backend: `npm test` desde `backend/` (Jest + Supertest)

## 🔐 Credenciales y seeds
- Al iniciar la app se crea un usuario admin por defecto: `admin@example.com / admin123`
- También se siembran algunos productos de ejemplo (uno con stock=0 para probar restricciones de stock).

## Endpoints útiles
- `/api/v1/auth/rate-info` — info de límite de intentos de login
- `/api/v1/cart` — GET/PUT para persistir carrito (autenticado)
- `/api/v1/sales/stats` — estadísticas agregadas (autenticado)

## Contribuir
- Lee `backend/README.md` y `frontend/README.md` para detalles de cada parte.

## 🐳 Docker y manejo de paquetes

- **Docker**: Los archivos `Dockerfile` y `docker-compose.yml` se mantienen en el repositorio para facilitar despliegues y ejecución reproducible en local/CI. Mantenerlos es recomendable si planeas usar contenedores.
- **Paquetes y lock files**: No es buena práctica subir `node_modules/` ni otros artefactos de dependencias. Si prefieres que los archivos de lock (`package-lock.json`) tampoco estén en el repositorio, ya están ignorados por `.gitignore`.
- **Paquetes y lock files**: No es buena práctica subir `node_modules/` ni otros artefactos de dependencias. En este repositorio **mantenemos** los lockfiles (`package-lock.json`) para garantizar reproducibilidad y estabilidad en CI/CD.

Si por alguna razón quieres quitar los lockfiles del repo en el futuro, puedes eliminar las líneas correspondientes del `.gitignore` y ejecutar:

```cmd
git rm --cached frontend\package-lock.json backend\package-lock.json
git commit -m "chore: remove package-lock.json files"
git push
```

Si por el contrario quieres (re)añadir los lockfiles al repositorio ahora, ejecuta:

```cmd
git add frontend\package-lock.json backend\package-lock.json
git commit -m "chore: add package-lock.json files"
git push
```
Si tienes dependencias instaladas localmente y quieres dejar de subirlas sin borrarlas del disco, puedes ejecutar (desde la raíz del proyecto, en cmd.exe):

```cmd
git rm -r --cached frontend\node_modules
git rm --cached frontend\package-lock.json frontend\node_modules\.package-lock.json backend\package-lock.json
git add .gitignore
git commit -m "chore: ignore frontend node_modules and package-lock files"
git push
```

Esto **no** borra tus archivos locales; sólo los quita del índice de Git para que no se suban en commits futuros.

Si prefieres mantener `package-lock.json` en el repo por reproducibilidad, elimina las líneas relevantes de `.gitignore` y mantén sólo la exclusión de `node_modules/`.

## 🖼️ Imágenes de productos

- El modelo `Product` ahora incluye un campo `image` que puede contener la URL de una imagen (externa o alojada en tu servidor). En el frontend puedes añadir la URL al crear un producto usando la opción **Agregar producto**; también puedes editar un producto y cambiar su `image`.
- Si prefieres alojar las imágenes en tu propio backend, considera añadir un endpoint de subida (por ejemplo usando `multer`) que guarde archivos en `backend/uploads/` y devuelva la URL para guardar en `product.image`. Recuerda añadir `/backend/uploads` a `.gitignore`.
- Para pruebas rápidas, el catálogo ya viene con imágenes de ejemplo para los productos semilla.

## 🛠️ Solución de problemas: productos o clientes no se muestran

Si al abrir la app en el navegador no se visualizan productos o la lista de clientes está vacía, sigue estos pasos:

1. Verifica que el **backend** esté corriendo:
	- En la carpeta `backend/` ejecuta:
	  - Windows (cmd.exe): `npm run dev`
	  - Unix: `npm run dev`

2. Asegúrate de que la base de datos tiene datos (ejecuta el seed):
	- `cd backend && npm run seed`
	- Debes ver `Seeding completed` en la salida. Si ves errores revisa el log y corrige el problema antes de continuar.

3. Comprueba que la **URL de la API** esté configurada correctamente en el frontend:
	- Revisa `frontend/.env` o la variable `VITE_API_URL` (por defecto: `http://localhost:4000/api/v1`).

4. Inicia el **frontend** y refresca la página:
	- `cd frontend && npm run dev`
	- Usa el botón **Refresh** en la cabecera de la aplicación para forzar la recarga de productos y clientes.

5. Ten en cuenta la **autenticación**:
	- La lista de clientes se carga sólo si hay una sesión activa (requiere login). Usa `admin@example.com / admin123` para acceder al sistema de pruebas.

6. Revisa la consola del navegador y la pestaña "Network" para errores:
	- Si hay respuestas 401 -> cierra sesión y vuelve a iniciar sesión.
	- Si hay errores CORS o de conexión, comprueba que la API está accesible desde `VITE_API_URL`.

7. Si los seeds fallan por problemas de esquema o foreign keys, revisa los logs del backend. Como último recurso puedes reiniciar la BD local (nota: esto eliminará datos):
	- Windows (cmd): `del backend\database.sqlite && cd backend && npm run seed`
	- Unix: `rm backend/database.sqlite && cd backend && npm run seed`

8. Ejecuta los tests para verificar flujos críticos:
	- `cd backend && npm test`

Si después de estos pasos sigues sin ver productos o clientes, copia aquí los mensajes de error de la consola o del seed y te ayudo a diagnosticarlo.
