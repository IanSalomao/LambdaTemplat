/**
 * Transforms an Express request object into an AWS Lambda event
 * @param {Object} req - Express request object
 * @returns {Object} Lambda event object
 */
export function reqToEvent(req) {
  // Create a basic API Gateway-like event structure
  const event = {
    httpMethod: req.method,
    path: req.path,
    pathParameters: req.params || {},
    queryStringParameters: req.query || {},
    headers: req.headers,
    body: typeof req.body === "object" ? JSON.stringify(req.body) : req.body || "",
    isBase64Encoded: false,
    requestContext: {
      requestId: `local-${Date.now()}`,
      requestTime: new Date().toISOString(),
      path: req.path,
      httpMethod: req.method,
      stage: "local",
    },
  };

  // Add multiValueHeaders and multiValueQueryStringParameters for API Gateway v1 compatibility
  event.multiValueHeaders = {};
  Object.entries(req.headers).forEach(([key, value]) => {
    event.multiValueHeaders[key] = Array.isArray(value) ? value : [value];
  });

  event.multiValueQueryStringParameters = {};
  Object.entries(req.query).forEach(([key, value]) => {
    event.multiValueQueryStringParameters[key] = Array.isArray(value) ? value : [value];
  });

  return event;
}
