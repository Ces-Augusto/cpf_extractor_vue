// Normaliza o texto extraído do PDF
export function normalizeText (text) {
  return text
    // remove espaços ao redor de pontos e traços
    .replace(/\s*\.\s*/g, '.')
    .replace(/\s*-\s*/g, '-')

    // remove espaços duplicados
    .replace(/\s+/g, ' ')
    .trim()
}

// Procura CPFs no texto
export function extractCpfs (text) {
  const normalizedText = normalizeText(text)

  // não deixa pegar CPF dentro de número maior
  const cpfRegex = /(?<!\d)(\d{3}\.\d{3}\.\d{3}-\d{2})(?!\d)/g

  const matches = [...normalizedText.matchAll(cpfRegex)].map(match => match[1])

  return matches
}

// Formata CPF para exibição
export function formatCpf (cpf) {
  const cleaned = cleanCpf(cpf)

  if (cleaned.length !== 11) {
    return cpf
  }

  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

// Remove pontos e traços
export function cleanCpf (cpf) {
  return cpf.replace(/\D/g, '')
}

// Valida matematicamente o CPF
export function isValidCpf (cpf) {
  const cleaned = cleanCpf(cpf)

  if (cleaned.length !== 11) {
    return false
  }

  if (/^(\d)\1{10}$/.test(cleaned)) {
    return false
  }

  let sum = 0
  let remainder = 0

  for (let i = 0; i < 9; i++) {
    sum += Number(cleaned[i]) * (10 - i)
  }

  remainder = (sum * 10) % 11
  if (remainder === 10) {
    remainder = 0
  }

  if (remainder !== Number(cleaned[9])) {
    return false
  }

  sum = 0

  for (let i = 0; i < 10; i++) {
    sum += Number(cleaned[i]) * (11 - i)
  }

  remainder = (sum * 10) % 11
  if (remainder === 10) {
    remainder = 0
  }

  if (remainder !== Number(cleaned[10])) {
    return false
  }

  return true
}

// Retorna análise completa
export function getCpfAnalysis (text) {
  const extractedCpfs = extractCpfs(text)

  return extractedCpfs.map((cpf) => {
    const cleaned = cleanCpf(cpf)
    const valid = isValidCpf(cpf)

    return {
      cpf: formatCpf(cpf),
      cleanCpf: cleaned,
      valid,
      status: valid ? 'success' : 'error',
      message: valid ? 'CPF válido' : 'CPF inválido'
    }
  })
}

// Retorna somente os válidos
export function getValidCpfs (text) {
  return getCpfAnalysis(text).filter((item) => item.valid)
}
