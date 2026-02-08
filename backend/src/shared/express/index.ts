export function createResponse(param: {
  data?: Record<string, unknown>;
  error?: string;
}) {
  const response: { data?: Record<string, unknown>; error?: string } = {};

  if (param.data) {
    response.data = param.data;
  }

  if (param.error) {
    response.error = param.error;
  }

  return response;
}
