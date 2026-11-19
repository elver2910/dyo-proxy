// Proxy transparente para HotPlayer -> Dyodelsa
// Despliega en Deno Deploy: https://dash.deno.com

const TARGET = "https://dyodelsa.vercel.app/api/hot";

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const targetUrl = TARGET + url.pathname + url.search;

  const headers = new Headers(req.headers);
  headers.set("host", "dyodelsa.vercel.app");

  let body: BodyInit | null = null;
  if (req.method !== "GET" && req.method !== "HEAD") {
    body = await req.arrayBuffer();
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    });

    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
});
