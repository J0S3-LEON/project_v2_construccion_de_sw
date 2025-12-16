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
