/**
 * Creates a mock AWS Lambda context object
 * @returns {Object} Mock Lambda context
 */
export function createMockContext() {
  const now = new Date();
  const requestId = `mock-${now.getTime()}-${Math.random().toString(36).substring(2, 15)}`;

  return {
    awsRequestId: requestId,
    functionName: "local-lambda-function",
    functionVersion: "local",
    invokedFunctionArn: "arn:aws:lambda:local:mock:function:local-lambda-function",
    memoryLimitInMB: "128",
    logGroupName: "/aws/lambda/local-lambda-function",
    logStreamName: `local/${now.getTime()}`,
    getRemainingTimeInMillis: () => 30000, // 30 seconds remaining
    callbackWaitsForEmptyEventLoop: true,
    // Add AWS Lambda-specific logging methods
    log: (msg) => console.log(msg),
    error: (msg) => console.error(msg),
    // Include deadline properties
    deadline: now.getTime() + 30000,
    clientContext: null,
    identity: null,
  };
}
