import { sendJson } from '../utils/response.js'

export function errorHandler(error, _request, response, _next) {
  console.error(error)

  return sendJson(response, 500, {
    success: false,
    message: 'Unexpected server error.',
    data: null,
  })
}
