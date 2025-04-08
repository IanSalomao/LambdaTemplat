/**
 * Ponto de entrada principal para a função Lambda
 *
 * Este arquivo é o handler principal que a AWS Lambda chamará.
 * Ele recebe o evento e o contexto da Lambda e gerencia o fluxo de execução.
 */

import { logEvent } from "./utils/logger.mjs";
import { processEvent } from "./handlers/eventHandler.mjs";

/**
 * Handler principal da função Lambda
 *
 * @param {Object} event - Evento recebido pela Lambda
 * @param {Object} context - Contexto da execução Lambda
 * @returns {Promise<Object>} - Resposta da função Lambda
 */
export const handler = async (event, context) => {
  try {
    // Registra informações sobre o evento recebido (sem dados sensíveis)
    logEvent("Evento recebido", { eventType: event.type || "desconhecido" });

    // Processa o evento
    const result = await processEvent(event, context);

    // Retorna o resultado
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    // Registra o erro
    console.error("Erro ao processar evento:", error);

    // Retorna resposta de erro
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Erro ao processar a solicitação",
        errorId: context.awsRequestId,
      }),
    };
  }
};
