const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Swagger UI</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
    <script>
        window.onload = function() {
            const ui = SwaggerUIBundle({
                url: "http://localhost:3000/api/swaggerJsonData", 
                dom_id: '#swagger-ui',
            });
        };
    </script>
</body>
</html>
`;

export async function GET(request: Request) {
  return new Response(htmlContent, {
    headers: { 'Content-Type': 'text/html' },
  });
}
