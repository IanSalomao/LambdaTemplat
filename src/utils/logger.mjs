/**
 * Utilitário de logging para a função Lambda
 *
 * Este arquivo fornece funções para logging consistente
 * em toda a aplicação.
 */

/**
 * Registra um evento com detalhes
 *
 * @param {string} message - Mensagem descritiva
 * @param {Object} details - Detalhes adicionais para o log
 */
export const logEvent = (message, details = {}) => {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      message,
      ...details,
    })
  );
};

/**
 * Registra informações
 *
 * @param {string} message - Mensagem informativa
 * @param {Object} data - Dados adicionais
 */
export const logInfo = (message, data = {}) => {
  console.log(
    JSON.stringify({
      level: "INFO",
      timestamp: new Date().toISOString(),
      message,
      ...data,
    })
  );
};

/**
 * Registra um aviso
 *
 * @param {string} message - Mensagem de aviso
 * @param {Object} data - Dados adicionais
 */
export const logWarning = (message, data = {}) => {
  console.warn(
    JSON.stringify({
      level: "WARNING",
      timestamp: new Date().toISOString(),
      message,
      ...data,
    })
  );
};

/**
 * Registra um erro
 *
 * @param {string} message - Mensagem de erro
 * @param {Error|Object} error - Objeto de erro ou dados adicionais
 */
export const logError = (message, error = {}) => {
  const errorData =
    error instanceof Error
      ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        }
      : error;

  console.error(
    JSON.stringify({
      level: "ERROR",
      timestamp: new Date().toISOString(),
      message,
      error: errorData,
    })
  );
};
