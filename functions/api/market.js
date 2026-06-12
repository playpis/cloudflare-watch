export async function onRequest() {
  return Response.json({
    test: "hello",
    version: 123456
  });
}
