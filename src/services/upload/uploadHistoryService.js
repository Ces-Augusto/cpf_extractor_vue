import { database, storage } from '@/services/firebase/firebase'

function sanitizeFileName (fileName) {
  return fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w.-]/g, '_')
}

function splitFileName (fileName) {
  const lastDotIndex = fileName.lastIndexOf('.')

  if (lastDotIndex === -1) {
    return {
      name: fileName,
      extension: ''
    }
  }

  return {
    name: fileName.substring(0, lastDotIndex),
    extension: fileName.substring(lastDotIndex)
  }
}

export async function generateUniqueFileName (fileName) {
  const snapshot = await database.ref('uploads').once('value')

  if (!snapshot.exists()) {
    return fileName
  }

  const existingNames = []

  snapshot.forEach(childSnapshot => {
    const upload = childSnapshot.val()

    if (upload && upload.fileName) {
      existingNames.push(upload.fileName)
    }
  })

  if (!existingNames.includes(fileName)) {
    return fileName
  }

  const { name, extension } = splitFileName(fileName)

  let counter = 1
  let newFileName = `${name}_${counter}${extension}`

  while (existingNames.includes(newFileName)) {
    counter++
    newFileName = `${name}_${counter}${extension}`
  }

  return newFileName
}

export async function uploadPdfToStorage (file) {
  const safeName = sanitizeFileName(file.name)
  const filePath = `uploads/pdfs/${Date.now()}_${safeName}`

  const storageRef = storage.ref(filePath)
  const snapshot = await storageRef.put(file)
  const downloadURL = await snapshot.ref.getDownloadURL()

  return {
    storagePath: filePath,
    downloadURL
  }
}

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
