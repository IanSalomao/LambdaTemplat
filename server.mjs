/**
 * Servidor local para testar funções Lambda
 *
 * Este arquivo cria um servidor HTTP que emula o ambiente AWS Lambda,
 * permitindo testar a função localmente sem precisar de Docker ou do AWS CLI.
 */

import http from "http";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { handler } from "./src/index.mjs";

// Carrega variáveis de ambiente do arquivo .env apenas em ambiente de desenvolvimento
const loadEnv = async () => {
  try {
    // Obtém o diretório atual
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const envPath = path.join(__dirname, ".env");

    // Verifica se o arquivo .env existe
    try {
      await fs.access(envPath);
    } catch (error) {
      console.log("Arquivo .env não encontrado, pulando carregamento de variáveis de ambiente");
      return;
    }

    // Lê o arquivo .env
    const envContent = await fs.readFile(envPath, "utf8");

    // Processa cada linha do arquivo
    envContent.split("\n").forEach((line) => {
      // Ignora linhas vazias ou comentários
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith("#")) {
        // Divide a linha em chave e valor
        const equalSignIndex = trimmedLine.indexOf("=");
        if (equalSignIndex > 0) {
          const key = trimmedLine.substring(0, equalSignIndex).trim();
          let value = trimmedLine.substring(equalSignIndex + 1).trim();

          // Remove aspas ao redor do valor, se presentes
          if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.substring(1, value.length - 1);
          }

          // Define a variável de ambiente
          process.env[key] = value;
        }
      }
    });

    console.log("Variáveis de ambiente carregadas com sucesso");
  } catch (error) {
    console.error("Erro ao carregar variáveis de ambiente:", error);
  }
};

// Carrega um evento de teste a partir de um arquivo
const loadTestEvent = async (eventName) => {
  try {
    // Obtém o diretório atual
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const eventsDir = path.join(__dirname, "events");

    // Se nenhum nome de evento foi especificado, usa example-event.json
    const eventFileName = eventName || "example-event.json";
    const eventPath = path.join(eventsDir, eventFileName);

    // Lê o arquivo de evento
    const eventContent = await fs.readFile(eventPath, "utf8");

    // Analisa o conteúdo como JSON
    return JSON.parse(eventContent);
  } catch (error) {
    console.error(`Erro ao carregar evento de teste "${eventName}":`, error);
    return { error: "Falha ao carregar evento de teste" };
  }
};

// Cria um contexto que emula o contexto AWS Lambda
const createMockContext = () => {
  return {
    awsRequestId: `mock-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
    functionName: "local-lambda-function",
    functionVersion: "local",
    invokedFunctionArn: "arn:aws:lambda:local:mock:function:local-lambda-function",
    memoryLimitInMB: "128",
    logGroupName: "/aws/lambda/local-lambda-function",
    logStreamName: `local/${Date.now()}`,
    getRemainingTimeInMillis: () => 30000, // 30 segundos restantes
    callbackWaitsForEmptyEventLoop: true,
  };
};

// Configura e inicia o servidor HTTP
const startServer = async () => {
  // Carrega variáveis de ambiente
  await loadEnv();

  // Define a porta do servidor
  const PORT = process.env.SERVER_PORT || 3000;

  // Cria o servidor HTTP
  const server = http.createServer(async (req, res) => {
    // Define cabeçalhos padrão
    res.setHeader("Content-Type", "application/json");

    // Roteamento básico
    if (req.url === "/health") {
      // Endpoint de verificação de saúde
      res.statusCode = 200;
      res.end(JSON.stringify({ status: "ok" }));
      return;
    } else if (req.url.startsWith("/invoke")) {
      // Extrai o nome do evento da URL
      const urlParts = req.url.split("/");
      const eventName = urlParts.length > 2 ? urlParts[2] : null;

      // Carrega o evento de teste
      const testEvent = await loadTestEvent(eventName);

      // Cria um contexto mock
      const mockContext = createMockContext();

      try {
        // Invoca o handler Lambda com o evento de teste
        console.log(`Invocando Lambda com evento "${eventName || "example-event.json"}"`);
        const result = await handler(testEvent, mockContext);

        // Retorna o resultado
        res.statusCode = 200;
        res.end(JSON.stringify(result, null, 2));
      } catch (error) {
        // Retorna o erro
        console.error("Erro ao invocar handler Lambda:", error);
        res.statusCode = 500;
        res.end(
          JSON.stringify(
            {
              error: "Erro ao invocar handler Lambda",
              message: error.message,
              stack: error.stack,
            },
            null,
            2
          )
        );
      }
      return;
    } else if (req.url === "/" || req.url === "/help") {
      // Página de ajuda
      res.statusCode = 200;
      res.end(
        JSON.stringify(
          {
            message: "Servidor Lambda local",
            endpoints: {
              "/health": "Verificação de saúde",
              "/invoke": "Invoca o handler Lambda com o evento example-event.json",
              "/invoke/{eventName}": "Invoca o handler Lambda com o evento especificado",
            },
            examples: {
              "/invoke": "Usa o arquivo events/example-event.json",
              "/invoke/custom-event.json": "Usa o arquivo events/custom-event.json",
            },
          },
          null,
          2
        )
      );
      return;
    }

    // Endpoint não encontrado
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Endpoint não encontrado" }));
  });

  // Inicia o servidor
  server.listen(PORT, () => {
    console.log(`Servidor Lambda local iniciado em http://localhost:${PORT}`);
    console.log(`Endpoints disponíveis:`);
    console.log(`  - http://localhost:${PORT}/health`);
    console.log(`  - http://localhost:${PORT}/invoke`);
    console.log(`  - http://localhost:${PORT}/invoke/{eventName}`);
    console.log(`  - http://localhost:${PORT}/help`);
  });

  // Trata o encerramento do servidor
  process.on("SIGINT", () => {
    console.log("Encerrando servidor...");
    server.close(() => {
      console.log("Servidor encerrado");
      process.exit(0);
    });
  });
};

// Inicia o servidor
startServer().catch((error) => {
  console.error("Erro ao iniciar servidor:", error);
  process.exit(1);
});
