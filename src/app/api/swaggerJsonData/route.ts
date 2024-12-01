import swaggerDocs from '../helperFunction/swagger';

export async function GET(request: Request) {
  return new Response(JSON.stringify(swaggerDocs), {
    headers: { 'Content-Type': 'application/json' },
  });
}
