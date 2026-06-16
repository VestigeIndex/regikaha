import { bad } from "../../../apilib/http";

export async function onRequestGet(context: any) {
  if (!context.env.MEDIA) return bad("El almacenamiento de imágenes no está configurado", 503);

  const path = Array.isArray(context.params.path)
    ? context.params.path.join("/")
    : String(context.params.path || "");
  if (!path.startsWith("media/")) return bad("Imagen no encontrada", 404);

  const object = await context.env.MEDIA.get(path);
  if (!object) return bad("Imagen no encontrada", 404);

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");

  return new Response(object.body, { headers });
}
