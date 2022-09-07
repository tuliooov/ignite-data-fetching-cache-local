import { useQuery } from 'react-query'
import { api } from '../api'

type User = {
  id: string
  name: string
  email: string
  createdAt: string
}

export async function getUser(userId: string): Promise<User> {
  const { data } = await api.get(`/users/${userId}`)

  const user = {
    ...data.user,
    createdAt: new Date(data.user.createdAt).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: '2-digit',
    }),
  }

  return user
}

export function useUser(userId: string) {
  return useQuery(['user', userId], () => getUser(userId), {
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}
