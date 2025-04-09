/**
 * Ponto de entrada principal para a função Lambda
 *
 * Este arquivo é o handler principal que a AWS Lambda chamará.
 * Ele recebe o evento e o contexto da Lambda e gerencia o fluxo de execução.
 */

import { logEvent } from "./utils/logger.mjs";
import { processEvent } from "./handlers/eventHandler.mjs";
import { sendResponse } from "./utils/responses.mjs";

/**
 * Handler principal da função Lambda
 *
 * @param {Object} event - Evento recebido pela Lambda
 * @param {Object} context - Contexto da execução Lambda
 * @returns {Promise<Object>} - Resposta da função Lambda
 */
export const handler = async (event, context) => {
  logEvent(event);
  try {
    // Processa o evento
    const result = await processEvent(event, context);

    return sendResponse(200, result);
  } catch (error) {
    // Registra o erro
    console.error("Erro ao processar evento:", error);

    // Retorna resposta de erro
    return sendResponse(500, {
      message: "Erro ao processar a solicitação",
      errorId: context.awsRequestId,
    });
  }
};
