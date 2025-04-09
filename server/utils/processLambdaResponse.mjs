/**
 * Processes a Lambda response and applies it to the Express response
 * @param {Object} lambdaResponse - Response from Lambda handler
 * @param {Object} res - Express response object
 */
export function processLambdaResponse(lambdaResponse, res) {
  // If the response is not an object, just send it as is
  if (!lambdaResponse || typeof lambdaResponse !== "object") {
    return res.send(lambdaResponse);
  }

  // Check if the response has statusCode property (API Gateway format)
  if (lambdaResponse.statusCode) {
    // Apply status code
    res.status(lambdaResponse.statusCode);

    // Apply headers if they exist
    if (lambdaResponse.headers) {
      Object.entries(lambdaResponse.headers).forEach(([key, value]) => {
        res.setHeader(key, value);
      });
    }

    // Apply multi-value headers if they exist
    if (lambdaResponse.multiValueHeaders) {
      Object.entries(lambdaResponse.multiValueHeaders).forEach(([key, values]) => {
        values.forEach((value) => {
          res.append(key, value);
        });
      });
    }

    // If the body is a string and isBase64Encoded is true, decode it
    let body = lambdaResponse.body;
    if (lambdaResponse.isBase64Encoded && typeof body === "string") {
      body = Buffer.from(body, "base64");
    }

    // If the response is JSON, parse it (if it's a string)
    if (res.getHeader("Content-Type")?.includes("application/json") || typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {
        // If parsing fails, keep it as a string
      }
    }

    return res.send(body);
  }

  // If it's not an API Gateway response format, just send the response as JSON
  return res.json(lambdaResponse);
}
