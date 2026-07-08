import { sendJson } from '../utils/response.js'

export function notFoundHandler(request, response) {
  return sendJson(response, 404, {
    success: false,
    message: `Route ${request.method} ${request.originalUrl} was not found.`,
    data: null,
  })
}
