/**
 * Script para criar um pacote de implantação da função Lambda
 *
 * Este script:
 * 1. Limpa diretórios temporários
 * 2. Cria uma estrutura de pasta dist
 * 3. Copia apenas os arquivos necessários para produção
 * 4. Instala apenas as dependências de produção
 * 5. Cria um arquivo zip pronto para upload para AWS Lambda
 */

import fs from "fs/promises";
import { createWriteStream } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import archiver from "archiver";

// Obtém o diretório atual
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const srcDir = path.join(rootDir, "src");
const packageJsonPath = path.join(rootDir, "package.json");
const zipFilePath = path.join(rootDir, "lambda-function.zip");

// Função para executar comandos shell
const execPromise = (command, cwd = rootDir) => {
  return new Promise((resolve, reject) => {
    console.log(`Executando: ${command}`);
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao executar comando: ${error.message}`);
        console.error(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        reject(error);
        return;
      }

      if (stderr) {
        console.warn(`stderr: ${stderr}`);
      }

      if (stdout) {
        console.log(`stdout: ${stdout}`);
      }

      resolve();
    });
  });
};

// Função para copiar um diretório recursivamente
const copyDir = async (src, dest) => {
  // Cria o diretório de destino se não existir
  await fs.mkdir(dest, { recursive: true });

  // Obtém o conteúdo do diretório
  const entries = await fs.readdir(src, { withFileTypes: true });

  // Para cada entrada no diretório
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // Se for um diretório, copia recursivamente
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      // Se for um arquivo, copia
      await fs.copyFile(srcPath, destPath);
    }
  }
};

// Função para criar um arquivo zip
const createZip = () => {
  return new Promise((resolve, reject) => {
    console.log(`Criando arquivo zip: ${zipFilePath}`);

    // Cria um stream de gravação para o arquivo zip
    const output = createWriteStream(zipFilePath);
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Nível máximo de compressão
    });

    // Eventos do stream
    output.on("close", () => {
      console.log(`Arquivo zip criado: ${archive.pointer()} bytes total`);
      resolve();
    });

    archive.on("error", (err) => {
      reject(err);
    });

    // Pipe do archive para o stream de gravação
    archive.pipe(output);

    // Adiciona o diretório dist ao arquivo zip
    archive.directory(distDir, false);

    // Finaliza o arquivo zip
    archive.finalize();
  });
};

// Função principal de build
const build = async () => {
  try {
    console.log("Iniciando processo de build...");

    // Limpa o diretório dist e o arquivo zip, se existirem
    console.log("Limpando diretórios e arquivos anteriores...");
    try {
      await fs.rm(distDir, { recursive: true, force: true });
      await fs.rm(zipFilePath, { force: true });
    } catch (error) {
      // Ignora erros se os arquivos não existirem
      console.log("Nenhum arquivo anterior para limpar ou erro ao limpar");
    }

    // Cria o diretório dist
    console.log("Criando diretório dist...");
    await fs.mkdir(distDir, { recursive: true });

    // Copia o diretório src para dist
    console.log("Copiando arquivos de origem...");
    await copyDir(srcDir, path.join(distDir, "src"));

    // Copia o package.json para dist
    console.log("Copiando package.json...");
    await fs.copyFile(packageJsonPath, path.join(distDir, "package.json"));

    // Instala apenas as dependências de produção no diretório dist
    console.log("Instalando dependências de produção...");
    await execPromise("npm install --production", distDir);

    // Cria o arquivo zip
    console.log("Criando arquivo zip para implantação...");
    await createZip();

    console.log("Build concluído com sucesso!");
    console.log(`Arquivo de implantação criado: ${zipFilePath}`);
    console.log("Você pode fazer upload deste arquivo zip para o AWS Lambda");
  } catch (error) {
    console.error("Erro durante o processo de build:", error);
    process.exit(1);
  }
};

// Executa a função de build
build();
