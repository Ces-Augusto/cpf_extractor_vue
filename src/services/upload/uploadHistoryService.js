import { database, storage } from '@/services/firebase/firebase'

function sanitizeFileName (fileName) {
  return fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w.-]/g, '_')
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

export async function saveCpfHistory ({ validCpfs, fileName, uploadId }) {
  const createdAt = Date.now()

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
  const { storagePath, downloadURL } = await uploadPdfToStorage(file)

  const { uploadId, createdAt } = await saveUploadHistory({
    file,
    validCpfs,
    storagePath,
    downloadURL
  })

  await saveCpfHistory({
    validCpfs,
    fileName: file.name,
    uploadId
  })

  return {
    uploadId,
    createdAt,
    storagePath,
    downloadURL
  }
}
