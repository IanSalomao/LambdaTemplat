/**
 * Manipulador de eventos para processar eventos recebidos
 *
 * Este arquivo contém a lógica para processar diferentes tipos de eventos.
 * Você pode expandir esta estrutura para manipular diferentes tipos de eventos
 * de acordo com suas necessidades específicas.
 */

import { exampleService } from "../services/exampleService.mjs";

/**
 * Processa o evento recebido
 *
 * @param {Object} event - Evento recebido pela Lambda
 * @param {Object} context - Contexto da execução Lambda
 * @returns {Promise<Object>} - Resultado do processamento
 */
export const processEvent = async (event, context) => {
  // Determine o tipo de evento e roteie para o manipulador apropriado
  const eventType = event.type || determineEventType(event);

  switch (eventType) {
    case "example":
      return await handleExampleEvent(event, context);
    // Adicione mais casos conforme necessário
    default:
      return await handleDefaultEvent(event, context);
  }
};

/**
 * Determina o tipo de evento baseado em sua estrutura
 *
 * @param {Object} event - Evento a ser analisado
 * @returns {string} - Tipo determinado do evento
 */
const determineEventType = (event) => {
  // Lógica para determinar o tipo de evento com base em sua estrutura
  // Esta é uma lógica de exemplo que você deve adaptar para seus casos específicos

  if (event.Records && Array.isArray(event.Records)) {
    return "sqs"; // Possível evento do SQS
  }

  if (event.httpMethod) {
    return "apiGateway"; // Possível evento do API Gateway
  }

  return "unknown";
};

/**
 * Manipula eventos de exemplo
 *
 * @param {Object} event - Evento de exemplo
 * @param {Object} context - Contexto da execução Lambda
 * @returns {Promise<Object>} - Resultado do processamento
 */
const handleExampleEvent = async (event, context) => {
  return await exampleService.processData(event.data);
};

/**
 * Manipula eventos desconhecidos ou padrão
 *
 * @param {Object} event - Evento desconhecido
 * @param {Object} context - Contexto da execução Lambda
 * @returns {Promise<Object>} - Resultado do processamento
 */
const handleDefaultEvent = async (event, context) => {
  return {
    message: "Evento processado com manipulador padrão",
    eventReceived: event,
  };
};
