const fs = require('fs/promises');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const PDFParser = require('pdf2json');

// Expressão regular para encontrar CPFs (com ou sem pontuação)
const cpfRegex = /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/;

// Função auxiliar para extrair texto usando pdf2json
function extrairTextoPdf(buffer) {
  return new Promise((resolve, reject) => {
    // O parâmetro '1' indica que queremos apenas o texto bruto (sem formatação visual)
    const pdfParser = new PDFParser(this, 1);

    pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
    pdfParser.on("pdfParser_dataReady", () => {
      resolve(pdfParser.getRawTextContent());
    });

    pdfParser.parseBuffer(buffer);
  });
}

async function processarPdf(caminhoEntrada, diretorioSaida) {
  try {
    // Verifica se o diretório de saída existe, se não, cria
    await fs.mkdir(diretorioSaida, { recursive: true });

    // Lê o arquivo PDF original
    const pdfBytesOriginal = await fs.readFile(caminhoEntrada);
    const documentoOriginal = await PDFDocument.load(pdfBytesOriginal);
    const totalPaginas = documentoOriginal.getPageCount();

    console.log(`Iniciando o processamento de ${totalPaginas} páginas...`);

    for (let i = 0; i < totalPaginas; i++) {
      // Cria um novo documento PDF para armazenar apenas a página atual
      const novoDocumento = await PDFDocument.create();
      const [paginaCopiada] = await novoDocumento.copyPages(documentoOriginal, [i]);
      novoDocumento.addPage(paginaCopiada);

      // Salva a página isolada em um buffer de memória
      const bytesNovaPagina = await novoDocumento.save();
      const bufferPagina = Buffer.from(bytesNovaPagina);

      // Extrai o texto da página usando a nova biblioteca
      const textoPagina = await extrairTextoPdf(bufferPagina);
      const matchCpf = textoPagina.match(cpfRegex);

      let nomeArquivo;

      if (matchCpf) {
        // Remove pontos e traços para deixar apenas os números no nome do arquivo
        const cpfLimpo = matchCpf[0].replace(/[^\d]/g, '');
        nomeArquivo = `${cpfLimpo}.pdf`;
      } else {
        // Fallback caso a página não contenha nenhum CPF legível
        nomeArquivo = `pagina_${i + 1}_sem_cpf.pdf`;
        console.warn(`Aviso: CPF não encontrado na página ${i + 1}.`);
      }

      // Salva o novo arquivo PDF no diretório especificado
      const caminhoFinal = path.join(diretorioSaida, nomeArquivo);
      await fs.writeFile(caminhoFinal, bytesNovaPagina);

      console.log(`Página ${i + 1} salva com sucesso: ${nomeArquivo}`);
    }

    console.log('\nProcesso concluído com sucesso!');

  } catch (erro) {
    console.error('Ocorreu um erro durante o processamento do PDF:', erro);
  }
}

const arquivoPdfEntrada = 'nome do arquivo.pdf';
const pastaDeDestino = 'C:/Users/seu-usuario/Documents/Arquivos processados';

processarPdf(arquivoPdfEntrada, pastaDeDestino);
