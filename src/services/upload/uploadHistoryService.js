import { database, storage } from '@/services/firebase/firebase'
// Sanitiza o nome do arquivo, removendo acentos e caracteres especiais
function sanitizeFileName (fileName) {
  return fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w.-]/g, '_')
}
// Divide o nome do arquivo em nome base e extensão
function splitFileName (fileName) {
  const lastDotIndex = fileName.lastIndexOf('.')
  // Se não houver ponto, retorna o nome completo e extensão vazia
  if (lastDotIndex === -1) {
    return {
      name: fileName,
      extension: ''
    }
  }
  // Retorna nome base e extensão, mantendo o ponto na extensão
  return {
    name: fileName.substring(0, lastDotIndex),
    extension: fileName.substring(lastDotIndex)
  }
}
// Gera um nome de arquivo único verificando o histórico de uploads no Firebase Realtime Database
export async function generateUniqueFileName (fileName) {
  const snapshot = await database.ref('uploads').once('value')
  // Se não houver uploads, retorna o nome original
  if (!snapshot.exists()) {
    return fileName
  }

  const existingNames = []
  // Coleta os nomes de arquivos existentes no histórico de uploads
  snapshot.forEach(childSnapshot => {
    const upload = childSnapshot.val()

    if (upload && upload.fileName) {
      existingNames.push(upload.fileName)
    }
  })
  // Se o nome do arquivo não existir no histórico, retorna o nome original
  if (!existingNames.includes(fileName)) {
    return fileName
  }
  // Se o nome já existir, gera um novo nome adicionando um sufixo numérico incremental
  const { name, extension } = splitFileName(fileName)

  let counter = 1
  let newFileName = `${name}_${counter}${extension}`
  // Continua incrementando o sufixo até encontrar um nome que não exista no histórico
  while (existingNames.includes(newFileName)) {
    counter++
    newFileName = `${name}_${counter}${extension}`
  }

  return newFileName
}
// Faz o upload do PDF para o Firebase Storage e retorna o caminho e URL de download
export async function uploadPdfToStorage (file) {
  const safeName = sanitizeFileName(file.name) // Garante que o nome do arquivo seja seguro para o sistema de arquivos
  const filePath = `uploads/pdfs/${Date.now()}_${safeName}` // Cria um caminho único para o arquivo usando timestamp e nome seguro

  const storageRef = storage.ref(filePath) // Referência ao arquivo no Firebase Storage
  const snapshot = await storageRef.put(file) // Faz o upload do arquivo para o Firebase Storage
  const downloadURL = await snapshot.ref.getDownloadURL() // Obtém a URL de download do arquivo após o upload ser concluído

  return {
    storagePath: filePath,
    downloadURL
  }
}
// Salva o histórico do upload, incluindo detalhes do arquivo e CPFs válidos
export async function saveUploadHistory ({ file, validCpfs, storagePath, downloadURL }) {
  const createdAt = Date.now()
  const uploadRef = database.ref('uploads').push()

  const uploadPayload = {
    fileName: file.name,
    storagePath,
    downloadURL,
    createdAt,
    cpfCount: validCpfs.length,
    cpfs: validCpfs.map(item => ({
      cpf: item.cpf,
      cleanCpf: item.cleanCpf,
      valid: item.valid
    }))
  }

  await uploadRef.set(uploadPayload)

  return {
    uploadId: uploadRef.key,
    createdAt
  }
}
// Salva cada CPF válido no histórico, associando ao upload
export async function saveCpfHistory ({ validCpfs, fileName, uploadId, createdAt }) {
  const promises = validCpfs.map(item => {
    const cpfRef = database.ref('cpfHistory').push()

    return cpfRef.set({
      cpf: item.cpf,
      cleanCpf: item.cleanCpf,
      fileName,
      uploadId,
      createdAt
    })
  })

  await Promise.all(promises)
}
// Processa o upload do PDF, salva histórico e retorna dados para exibição
export async function processPdfUpload ({ file, validCpfs }) {
  const uniqueFileName = await generateUniqueFileName(file.name)

  const renamedFile = new File([file], uniqueFileName, {
    type: file.type
  })

  const { storagePath, downloadURL } = await uploadPdfToStorage(renamedFile)

  const { uploadId, createdAt } = await saveUploadHistory({
    file: renamedFile,
    validCpfs,
    storagePath,
    downloadURL
  })

  await saveCpfHistory({
    validCpfs,
    fileName: renamedFile.name,
    uploadId,
    createdAt
  })

  return {
    uploadId,
    createdAt,
    storagePath,
    downloadURL,
    fileName: renamedFile.name
  }
}
