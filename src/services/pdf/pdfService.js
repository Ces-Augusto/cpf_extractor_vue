import * as pdfjsLib from 'pdfjs-dist/es5/build/pdf'
import pdfWorker from 'pdfjs-dist/es5/build/pdf.worker.entry'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

export async function extractTextFromPdf (file) {
  const arrayBuffer = await file.arrayBuffer()
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

  return fullText.trim()
}
