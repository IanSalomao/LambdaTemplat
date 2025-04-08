/**
 * Utilitário para gerenciar variáveis de ambiente
 *
 * Este arquivo fornece funções para obter variáveis de ambiente
 * com valores padrão e validação.
 */

/**
 * Obtém uma variável de ambiente
 *
 * @param {string} key - Nome da variável de ambiente
 * @param {string|null} defaultValue - Valor padrão se a variável não existir
 * @param {boolean} required - Se true, lança um erro se a variável não existir
 * @returns {string} - Valor da variável de ambiente
 * @throws {Error} - Se a variável for obrigatória e não existir
 */
export const getEnv = (key, defaultValue = null, required = false) => {
  const value = process.env[key] || defaultValue;

  if (required && value === null) {
    throw new Error(`Variável de ambiente obrigatória não definida: ${key}`);
  }

  return value;
};

/**
 * Obtém uma variável de ambiente numérica
 *
 * @param {string} key - Nome da variável de ambiente
 * @param {number|null} defaultValue - Valor padrão se a variável não existir
 * @param {boolean} required - Se true, lança um erro se a variável não existir
 * @returns {number} - Valor numérico da variável de ambiente
 * @throws {Error} - Se a variável for obrigatória e não existir ou não for um número válido
 */
export const getNumericEnv = (key, defaultValue = null, required = false) => {
  const stringValue = getEnv(key, defaultValue !== null ? String(defaultValue) : null, required);

  if (stringValue === null) {
    return null;
  }

  const numericValue = Number(stringValue);

  if (isNaN(numericValue)) {
    throw new Error(`Variável de ambiente ${key} não é um número válido: ${stringValue}`);
  }

  return numericValue;
};

/**
 * Obtém uma variável de ambiente booleana
 *
 * @param {string} key - Nome da variável de ambiente
 * @param {boolean|null} defaultValue - Valor padrão se a variável não existir
 * @param {boolean} required - Se true, lança um erro se a variável não existir
 * @returns {boolean} - Valor booleano da variável de ambiente
 * @throws {Error} - Se a variável for obrigatória e não existir
 */
export const getBooleanEnv = (key, defaultValue = null, required = false) => {
  const stringValue = getEnv(key, defaultValue !== null ? String(defaultValue) : null, required);

  if (stringValue === null) {
    return null;
  }

  return ["true", "1", "yes"].includes(stringValue.toLowerCase());
};

/**
 * Obtém uma variável de ambiente como JSON
 *
 * @param {string} key - Nome da variável de ambiente
 * @param {Object|Array|null} defaultValue - Valor padrão se a variável não existir
 * @param {boolean} required - Se true, lança um erro se a variável não existir
 * @returns {Object|Array} - Valor JSON analisado da variável de ambiente
 * @throws {Error} - Se a variável for obrigatória e não existir ou não for um JSON válido
 */
export const getJsonEnv = (key, defaultValue = null, required = false) => {
  const stringValue = getEnv(key, defaultValue !== null ? JSON.stringify(defaultValue) : null, required);

  if (stringValue === null) {
    return null;
  }

  try {
    return JSON.parse(stringValue);
  } catch (error) {
    throw new Error(`Variável de ambiente ${key} não é um JSON válido: ${error.message}`);
  }
};
