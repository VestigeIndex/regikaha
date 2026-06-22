// Registro estructurado de errores. Cloudflare captura console.error en los
// logs de la Function (y en Logpush si está activado), así que esto da
// visibilidad de fallos en producción sin acoplar un proveedor externo.
export function logError(scope: string, error: unknown, context?: Record<string, unknown>) {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  try {
    console.error(JSON.stringify({ level: "error", scope, message, stack, ...context, at: new Date().toISOString() }));
  } catch {
    console.error("regikaha_error", scope, message);
  }
}
