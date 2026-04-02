import { database } from '@/services/firebase/firebase'

export async function getAllCpfHistory () {
  const snapshot = await database.ref('cpfHistory').once('value')

  if (!snapshot.exists()) return []

  const list = []

  snapshot.forEach(child => {
    list.push({
      id: child.key,
      ...child.val()
    })
  })

  return list.sort((a, b) => b.createdAt - a.createdAt)
}
