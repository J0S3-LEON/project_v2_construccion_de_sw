# Frontend - Kioma Sport (proyecto final curso)

Rápido manual para correr el frontend localmente:

1. Instalar dependencias

```cmd
cd frontend
npm install
```

2. Crear `.env` a partir de `.env.example` y ajustar `VITE_API_URL` si tu backend corre en otro puerto

3. Levantar en modo dev

```cmd
npm run dev
```

Este frontend es intencionalmente simple: hooks ligeros (`useAuth`, `useProducts`, `useClients`, `useSales`) y componentes básicos para integrar con el backend.
