export function sendJson(response, statusCode, payload) {
  return response.status(statusCode).json({
    success: payload.success ?? statusCode < 400,
    message: payload.message,
    data: payload.data ?? null,
    errors: payload.errors ?? null,
    meta: payload.meta ?? null,
  })
}
