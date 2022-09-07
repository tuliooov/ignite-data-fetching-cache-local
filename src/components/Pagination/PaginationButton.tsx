import { Button } from '@chakra-ui/react'
import { api } from '../../services/api'
import { queryClient } from '../../services/queryClient'

interface PaginationButtonProps {
  number: number
  isCurrent?: boolean
  onPageChange: (page: number) => void
}

export function PaginationButton({
  isCurrent = false,
  number,
  onPageChange,
}: PaginationButtonProps) {
  if (isCurrent) {
    return (
      <Button
        size="sm"
        fontSize="xs"
        width="4"
        colorScheme="pink"
        disabled
        _disabled={{
          bg: 'pink.500',
          cursor: 'default',
        }}
      >
        {number}
      </Button>
    )
  }

  async function handlePrefetchPage(number: number) {
    await queryClient.prefetchQuery(
      ['users', number],
      async () => {
        const { data, headers } = await api.get('/users', {
          params: {
            page: number,
          },
        })

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

        const totalCount = Number(headers['x-total-count'])

        return { users, totalCount }
      },
      { staleTime: 1000 * 60 * 10 } // 10 minutes
    )
  }

  return (
    <Button
      size="sm"
      fontSize="xs"
      width="4"
      bg="gray.700"
      _hover={{ bg: 'gray.500' }}
      onClick={() => onPageChange(number)}
      onMouseEnter={() => handlePrefetchPage(number)}
    >
      {number}
    </Button>
  )
}
