export default function errorHandler(err, req, res, next) {
  // No revelar detalles en producción
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message;
  console.error(err);
  res.status(status).json({ error: message });
}
