# node-separador-pdf-por-cpf

Este script em Node.js automatiza a tarefa de pegar um arquivo PDF com múltiplas páginas (como um Informe de Rendimentos) e dividir cada página em um arquivo individual, nomeando-o automaticamente com base no texto extraído de dentro da página (ex: nome do beneficiário).

## Funcionalidades

- Divisão Automática: Separa cada página do PDF original em um novo arquivo.

- Nomeação Inteligente: Utiliza Regex para localizar nomes/beneficiários dentro do documento.

- Tratamento de Duplicados: Se houver mais de uma página para a mesma pessoa, o script adiciona um sufixo (ex: Nome_1.pdf) para evitar sobrescrita.

- Sanitização: Remove caracteres inválidos que o Windows não permite em nomes de arquivos.

## Pré-requisitos

- Node.js (Versão 18 ou superior recomendada)

- NPM (Já vem com o Node)

## Instalação

1. Clone este repositório ou baixe os arquivos.

2. Abra o terminal na pasta do projeto e instale as dependências necessárias:

```
npm install pdf-lib pdf-parse
```

## Configuração

1. No arquivo src/index.js, certifique-se de ajustar os caminhos do arquivo de entrada e da pasta de saída:

2. JavaScript

```
const arquivo = 'C:\\Caminho\\Para\\Seu\\Arquivo.pdf';
const saida = 'C:\\Caminho\\Para\\Pasta\\Output';
```

3. Ajuste de Reconhecimento (Regex)
   Se o script não encontrar o nome corretamente, ajuste a linha do Regex no código:

4. JavaScript

```
const nameMatch = pageText.match(/(?:Nome|Beneficiário):\s*([^\n\r]+)/i);
```

## Como usar

Para iniciar o processamento, execute o comando abaixo no seu terminal:

```
node ./src/index.js
```

O script exibirá o progresso no console página por página:

```text
📂 Iniciando processamento de 185 páginas...
✅ [1/185] Salvo: JOAO DA SILVA.pdf
✅ [2/185] Salvo: MARIA OLIVEIRA.pdf
📝 Bibliotecas Utilizadas
pdf-lib - Para manipulação da estrutura e criação de novos PDFs.

pdf-parse - Para extração de texto de PDFs legíveis.
```
