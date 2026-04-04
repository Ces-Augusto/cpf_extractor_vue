import * as pdfjsLib from 'pdfjs-dist/es5/build/pdf'
import pdfWorker from 'pdfjs-dist/es5/build/pdf.worker.entry'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

export async function extractTextFromPdf (file) {
  const arrayBuffer = await file.arrayBuffer() // carrega file que vem do input e converte para arrayBuffer, que é o formato que o pdfjsLib espera
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

  let fullText = ''

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber)
    const textContent = await page.getTextContent()

    const pageText = textContent.items
      .map(item => item.str)
      .join(' ')

    fullText += `${pageText} `
  }

  return fullText.trim() // retorna string com todo texto do documento
}
