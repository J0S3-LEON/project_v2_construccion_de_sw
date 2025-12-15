# Kioma Sport - Backend

Monolito modular por dominio (JavaScript + Express)

Rápida guía para levantar el proyecto localmente:

1. Instalar dependencias

```cmd
cd backend
npm install
```

2. Crear `.env` a partir de `.env.example` y ajusta valores (JWT, CORS)

3. Levantar en modo desarrollo

```cmd
npm run dev
```

El servidor expondrá la API en `http://localhost:4000/api/v1` por defecto.

Estructura del proyecto:
- `src/` - código fuente
- `src/modules` - dominios (auth, clients, products, sales)
- `src/common` - middlewares y utilidades

Próximos pasos:
- Implementar core de Express y middlewares (Helmet, CORS, rate-limiter)
- Implementar módulo `auth` (register/login)
- Añadir tests con Jest + Supertest
