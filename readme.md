# Template para Funções AWS Lambda em Node.js

Este é um template padronizado para o desenvolvimento de funções AWS Lambda utilizando Node.js 22.x com arquivos `.mjs`. O template fornece uma estrutura organizada para melhorar a manutenibilidade e padronizar o desenvolvimento de funções Lambda.

## Características

- Estrutura de pastas organizada e padronizada
- Servidor local para testar funções Lambda sem Docker ou AWS CLI
- Sistema de eventos de teste similar ao console da AWS Lambda
- Gerenciamento de variáveis de ambiente para desenvolvimento e produção
- Script de build para criar um pacote de implantação adequado para AWS Lambda
- Utilitários para logging e manipulação de variáveis de ambiente
- Suporte para testes unitários

## Estrutura do Projeto

```
lambda-template/
├── src/                     # Código fonte da função Lambda
│   ├── handlers/            # Manipuladores de eventos
│   ├── services/            # Lógica de negócios
│   ├── utils/               # Funções utilitárias
│   └── index.mjs            # Ponto de entrada principal da Lambda
├── events/                  # Eventos de teste
│   └── example-event.json   # Exemplo de evento para testes
├── tests/                   # Testes unitários
│   └── unit/                # Arquivos de teste unitário
├── .env.example             # Exemplo de variáveis de ambiente
├── .gitignore               # Arquivos a serem ignorados pelo Git
├── package.json             # Configuração do pacote com scripts
├── README.md                # Documentação do projeto
└── server.mjs               # Servidor local para testes
```

## Pré-requisitos

- Node.js 22.x ou superior
- npm (geralmente instalado com o Node.js)

## Configuração Inicial

1. Clone ou baixe este template para o seu computador
2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` baseado no `.env.example`:

```bash
cp .env.example .env
```

4. Edite o arquivo `.env` com suas configurações específicas

## Executando Localmente

Para iniciar o servidor local e testar sua função Lambda:

```bash
npm start
```

Isto iniciará um servidor HTTP na porta especificada (padrão: 3000) com os seguintes endpoints:

- `http://localhost:3000/health` - Verificação de saúde do servidor
- `http://localhost:3000/invoke` - Invoca a função Lambda com o evento padrão (example-event.json)
- `http://localhost:3000/invoke/{nome-do-evento}` - Invoca a função Lambda com um evento específico
- `http://localhost:3000/help` - Exibe informações de ajuda

## Testando Eventos

Para criar novos eventos de teste, adicione arquivos JSON ao diretório `events/`. Por exemplo:

```json
// events/meu-evento.json
{
  "type": "customEvent",
  "data": {
    "id": "12345",
    "message": "Meu evento personalizado"
  }
}
```

Em seguida, você pode testar este evento acessando:

```
http://localhost:3000/invoke/meu-evento.json
```

## Criando um Pacote para Implantação

Para criar um arquivo zip pronto para implantação na AWS Lambda:

```bash
npm run build
```

Este comando:

1. Limpa diretórios temporários anteriores
2. Cria uma estrutura de pasta `dist` com apenas os arquivos necessários
3. Instala apenas as dependências de produção
4. Cria um arquivo `lambda-function.zip` pronto para upload para AWS Lambda

## Implantação na AWS

Após criar o arquivo zip, você pode implantá-lo na AWS Lambda:

1. Acesse o console da AWS Lambda
2. Crie uma nova função ou selecione uma existente
3. Configure o runtime para Node.js 22.x
4. Na seção "Código da função", selecione "Carregar a partir de" > ".zip file"
5. Faça upload do arquivo `lambda-function.zip`
6. Configure variáveis de ambiente conforme necessário
7. Configure as permissões e outras configurações da função
8. Clique em "Salvar" ou "Implantar"

## Boas Práticas

- Mantenha sua lógica de negócios em módulos separados
- Use o sistema de logging para registrar eventos importantes
- Crie eventos de teste para diferentes cenários
- Adicione testes unitários para sua lógica de negócios
- Não armazene credenciais no código ou em arquivos versionados

## Customização

Este template é um ponto de partida. Sinta-se à vontade para:

- Adicionar mais diretórios conforme necessário
- Instalar dependências adicionais para suas necessidades específicas
- Modificar os scripts ou a estrutura para melhor atender seus requisitos

## Solução de Problemas

### Erro ao iniciar o servidor local

Verifique se:

- A porta configurada não está sendo usada por outro processo
- O arquivo `.env` existe e está configurado corretamente
- Todos os módulos foram instalados corretamente

### Erro ao criar o pacote de implantação

Verifique se:

- Você tem permissões de escrita no diretório
- Todas as dependências de desenvolvimento estão instaladas
- Não há erros de sintaxe em seu código

## Perguntas Frequentes

**P: Por que usar arquivos .mjs em vez de .js?**
R: Os arquivos .mjs forçam o uso do sistema de módulos ECMAScript, proporcionando uma experiência de desenvolvimento mais consistente e modern.

**P: Como adicionar dependências?**
R: Use `npm install --save nome-do-pacote` para dependências de produção ou `npm install --save-dev nome-do-pacote` para dependências de desenvolvimento.

**P: Como criar testes unitários?**
R: Adicione arquivos de teste ao diretório `tests/unit/` e execute-os com `npm test`.

## Contribuição

Sinta-se à vontade para contribuir para este template através de pull requests ou relatando problemas.

## Licença

Este template está licenciado sob a licença ISC.
