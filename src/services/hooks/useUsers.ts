import { useQuery, UseQueryOptions } from 'react-query'
import { api } from '../api'

type User = {
  id: string
  name: string
  email: string
  createdAt: string
}

export type GetUsersResponse = {
  totalCount: number
  users: User[]
}

export async function getUsers(page: number): Promise<GetUsersResponse> {
  try {
    const { data, headers } = await api.get('/users', {
      params: {
        page,
      },
    })

    const totalCount = Number(headers['x-total-count'])

    const users = data.users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: new Date(user.created_at).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
      }
    })

    return { users, totalCount }
  } catch (err) {
    console.log(err.message)
  }
}

// export function useUsers(page: number, options: UseQueryOptions) {
export function useUsers(page: number) {
  // since the list of users are in cache
  // we have to tell to react-query how a list of users (a page of users)
  // differs from each other with ['users', page]
  return useQuery(['users', page], () => getUsers(page), {
    staleTime: 1000 * 60 * 10, // 10 minutes
    // ...options,
    // initialData: {
    //   users: [
    //     { id: '1', name: 'mock', email: 'mock', createdAt: String(new Date()) },
    //   ],
    //   totalCount: 1,
    // },
  })
}
