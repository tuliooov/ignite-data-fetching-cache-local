import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Icon,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Link as ChakraLink,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { RiAddLine } from 'react-icons/ri'
import { api } from '../services/api'
import { useUser } from '../services/hooks/useUser'
import { GetUsersResponse } from '../services/hooks/useUsers'
import { queryClient } from '../services/queryClient'
import { ModalEditUser } from './ModalEditUser'

interface UsersTableProps {
  isMobile: boolean
  isLoading: boolean
  isFetching: boolean
  error: unknown
  data?: GetUsersResponse
  currentPage: number
}

export function UsersTable({
  isMobile,
  isLoading,
  isFetching,
  error,
  data,
  currentPage,
}: UsersTableProps) {
  const [user, setUser] = useState(null)

  async function handlePrefetchUser(userId: string) {
    await queryClient.prefetchQuery(
      ['user', userId],
      async () => {
        const { data } = await api.get(`/users/${userId}`)

        const user = {
          ...data.user,
          createdAt: new Date(data.user.created_at).toLocaleDateString(
            'pt-BR',
            {
              day: '2-digit',
              month: 'long',
              year: '2-digit',
            }
          ),
        }

        return user
      },
      { staleTime: 1000 * 60 * 10, cacheTime: 1000 * 60 * 5 }
      // cacheTime has the default of 5min
      // after 5min of an instance being inactive this cached instance will be deleted
    )
  }

  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleEditUser = (userId: string) => {
    setUser(userId)
    onOpen()
  }

  return (
    <>
      <Flex mb="8" justify="space-between" align="center">
        <Heading fontSize={['md', 'lg']} fontWeight="normal">
          Usuários{' '}
          {!isLoading && isFetching && (
            <Spinner size="sm" color="gray.500" ml="4" />
          )}
          {/* isLoading is the first loading, isFetching is a revalidating state */}
        </Heading>
        <Link href="/users/create" passHref>
          <Button
            as="a"
            size="sm"
            fontSize="sm"
            colorScheme="pink"
            leftIcon={<Icon as={RiAddLine} fontSize="20" />}
          >
            Criar novo
          </Button>
        </Link>
      </Flex>

      {isLoading ? (
        <Flex justify="center">
          <Spinner />
        </Flex>
      ) : error ? (
        <Flex justify="center">
          <Text>Falha ao obter dados dos usuários</Text>
        </Flex>
      ) : (
        <Table colorScheme="whiteAlpha" overflowX="scroll">
          <Thead>
            <Tr>
              <Th px={['4', '4', '6']} color="gray.300" width="8">
                <Checkbox colorScheme="pink" />
              </Th>
              <Th>Usuário</Th>
              {!isMobile && <Th>Data de cadastro</Th>}
            </Tr>
          </Thead>
          <Tbody>
            {data.users.map((user) => (
              <Tr key={user.id}>
                <Td px={['4', '4', '6']}>
                  <Checkbox colorScheme="pink" />
                </Td>
                <Td>
                  <Box>
                    <Text fontWeight="bold">
                      <ChakraLink
                        color="purple.400"
                        onMouseEnter={() => handlePrefetchUser(user.id)}
                        onClick={() => handleEditUser(user.id)}
                      >
                        {user.name}
                      </ChakraLink>
                    </Text>

                    <Text fontSize="sm" color="gray.300">
                      {user.email}
                    </Text>
                  </Box>
                </Td>
                {!isMobile && <Td>{user.createdAt}</Td>}
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
      {!!user && (
        <ModalEditUser
          currentPage={currentPage}
          userId={user}
          onClose={onClose}
          isOpen={isOpen}
        />
      )}
    </>
  )
}
