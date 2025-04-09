export function sendRedirect(url) {
  return {
    statusCode: 302,
    headers: {
      Location: url,
    },
  };
}

export function sendResponse(statusCode, body) {
  return {
    statusCode,
    body: JSON.stringify(body),
  };
}

export function sendAuthError() {
  return {
    statusCode: 302,
    headers: {
      Location: "http://localhost:3000/eror",
    },
  };
}
