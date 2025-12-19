# Kioma Sport — Proyecto final 🚀

Pequeña aplicación de ejemplo: **API REST** en Node.js + Express (modular por dominio) y **frontend** en React (Vite).

## 📁 Estructura del repositorio
- `backend/` — API REST (ESM, Sequelize, SQLite por defecto)
- `frontend/` — App React (Vite)

---

## 🧭 Requisitos
- Node.js >= 18
- npm >= 9
- (Opcional) Docker y docker-compose para ejecutar en contenedores

---

## 🚀 Quickstart (local)
Sigue estos pasos para levantar la aplicación en tu máquina (Windows/cmd shown):

1) Backend

```cmd
cd backend
npm install
copy .env.example .env   # Windows (o: cp .env.example .env)
# Ajusta variables en .env si lo necesitas
npm run dev    # arranca el servidor en modo desarrollo (nodemon)
```

- Por defecto la API queda en: `http://localhost:4000/api/v1`
- Ejecuta seeds si quieres datos iniciales:

```cmd
cd backend
npm run seed
```

2) Frontend

```cmd
cd frontend
npm install
copy .env.example .env   # adapta VITE_API_URL si tu API usa otro puerto
npm run dev
```

- Frontend por defecto: `http://localhost:5173/`
- `VITE_API_URL` por defecto apunta a `http://localhost:4000/api/v1`.

---

## 🔐 Credenciales y datos de ejemplo
- Usuario admin por defecto (seed): **admin@example.com / admin123**
- El seed también inserta varios productos y clientes para pruebas (uno de los productos tiene stock=0 para validar restricciones).

---

## 🧪 Tests
- Backend: desde `backend/` ejecuta:

```cmd
npm test
```

Los tests usan Jest + Supertest.

---

## 🐳 Docker (opcional)
Si prefieres contenerizar:

```cmd
# Desde la raíz
docker-compose up --build
```

El contenedor expone el puerto 4000 por defecto.

---

## 🔧 Solución de problemas comunes
- No aparecen productos/clientes en la UI:
  1. Verifica que el backend esté corriendo (`npm run dev`) y que la ruta `VITE_API_URL` sea correcta.
  2. Ejecuta `npm run seed` en `backend` para poblar la DB.
  3. Revisa la consola del navegador (Network) para detectar 401/CORS/errores de conexión.

- Puerto 4000 en uso: revisa qué proceso usa el puerto o arranca la app con otra variable de entorno:

```cmd
# iniciar en puerto alternativo
set PORT=4001 && npm run dev
```

- Vulnerabilidades en dependencias: ejecuta `npm audit` y revisa `npm audit fix` (si usas `--force`, puede introducir cambios breaking).

---

## 📋 Buenas prácticas & notas
- No subas `node_modules/` al repositorio. Mantén los `package-lock.json` para reproducibilidad.
- Añadimos `.env` y archivos `*.sqlite` a `.gitignore` para evitar subir secretos o bases locales.
- Si quieres que aplique correcciones automáticas de vulnerabilidades (`npm audit fix --force`) dímelo y hago una PR separada para revisar cambios.

---

## 🤝 Contribuir
- Si quieres contribuir: crea una rama desde `main`, trabaja tu cambio y abre un PR.
- Si necesitas ayuda para crear el PR, puedo hacerlo por ti (me puedes dar permiso o crear el PR manualmente desde la URL que te proporcioné).

---

Si quieres, puedo commitear este README y crear un PR en la rama `update/deps` (o en otra rama que prefieras). Dime si procedo con el commit y push. ✨
