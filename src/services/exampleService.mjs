/**
 * Serviço de exemplo para processar dados
 *
 * Este arquivo contém um serviço de exemplo que demonstra como
 * você pode organizar sua lógica de negócios em serviços separados.
 */

/**
 * Serviço de exemplo com métodos para processamento de dados
 */
class ExampleService {
  /**
   * Processa dados recebidos
   *
   * @param {Object|Array} data - Dados a serem processados
   * @returns {Promise<Object>} - Resultado do processamento
   */
  async processData(data) {
    // Exemplo de lógica de processamento
    if (!data) {
      throw new Error("Dados não fornecidos para processamento");
    }

    // Se os dados forem uma matriz, processe cada item
    if (Array.isArray(data)) {
      return {
        processedItems: await Promise.all(data.map((item) => this.processItem(item))),
        totalItems: data.length,
      };
    }

    // Se for um único item, processe-o
    return {
      processedItem: await this.processItem(data),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Processa um único item de dados
   *
   * @param {Object} item - Item a ser processado
   * @returns {Promise<Object>} - Item processado
   */
  async processItem(item) {
    // Esta é uma função de exemplo - substitua com sua lógica real
    return {
      ...item,
      processed: true,
      processingTimestamp: new Date().toISOString(),
    };
  }
}

// Exporta uma instância única do serviço
export const exampleService = new ExampleService();
