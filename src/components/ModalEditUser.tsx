import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  VStack,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { api } from '../services/api'
import { useUser } from '../services/hooks/useUser'
import { queryClient } from '../services/queryClient'
import { Input } from './Form/Input'

interface ModalEditUserProps {
  userId: string
  isOpen: boolean
  currentPage: number
  onClose: () => void
}

interface UserData {
  name: string
  email: string
  createdAt: string
}

export function ModalEditUser({
  isOpen,
  onClose,
  userId,
  currentPage,
}: ModalEditUserProps) {
  const { data, isLoading, isFetching } = useUser(userId)

  const [state, setState] = useState({
    name: '',
    email: '',
    createdAt: '',
  })

  const editUser = useMutation(
    async (data: UserData) => {
      const { createdAt, ...updated } = data
      const response = await api.put(`/users/${userId}`, {
        user: updated,
      })
      return response.data.user
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user', userId]) // invalidate ['users', userId]
        // onSuccess we want to reset the user cache, because the data has been modified
        queryClient.invalidateQueries(['users', currentPage])
        // onSuccess we also want to reset the users cache
      },
    }
  )

  useEffect(() => {
    if (data)
      setState({
        name: data.name,
        email: data.email,
        createdAt: data.createdAt,
      })
  }, [data])

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement
    setState({ ...state, [target.name]: target.value })
  }

  const handleEditUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await editUser.mutateAsync(state)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay zIndex={10} />
      <ModalContent
        bgColor="#333"
        color="#f4f4f4"
        m={[4, 4, 0]}
        as="form"
        onSubmit={handleEditUser}
      >
        <ModalHeader>
          Editar usuário{' '}
          {!isLoading && isFetching && (
            <Spinner size="sm" color="gray.500" ml="4" />
          )}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading ? (
            <Spinner color="purple.400" />
          ) : (
            <VStack>
              <Input
                name="name"
                value={state.name}
                onChange={(event) => handleChange(event)}
              />
              <Input
                name="email"
                value={state.email}
                onChange={(event) => handleChange(event)}
              />
              <Input
                name="createdAt"
                value={state.createdAt}
                onChange={(event) => handleChange(event)}
              />
            </VStack>
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="pink" variant="outline" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="purple" type="submit">
            Editar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
