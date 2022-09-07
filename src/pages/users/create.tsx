import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Spinner,
  VStack,
} from '@chakra-ui/react'
import Link from 'next/link'
import { Input } from '../../components/Form/Input'
import { Header } from '../../components/Header'
import { Sidebar } from '../../components/Sidebar'
import { useMediaQueryContext } from '../../contexts/MediaQueryContext'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from 'react-query'
import { api } from '../../services/api'
import { queryClient } from '../../services/queryClient'
import { useRouter } from 'next/router'
interface ReturnUseMediaQueryContext {
  isMobile: boolean
  isLoading: boolean
}

type UserCreateFormData = {
  name: string
  email: string
  password: string
  password_confirmation: string
}

const userCreateFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
  password: yup
    .string()
    .required('Senha obrigatória')
    .min(6, 'No mínimo 6 caracteres'),
  password_confirmation: yup
    .string()
    .required('Confirmação obrigatória')
    .oneOf(['', yup.ref('password')], 'As senhas precisam ser iguais'),
})

export default function UserCreate() {
  const { isMobile, isLoading } =
    useMediaQueryContext() as ReturnUseMediaQueryContext

  const router = useRouter()

  const createUser = useMutation(
    async (user: UserCreateFormData) => {
      const response = await api.post('/users', {
        user: {
          ...user,
          created_at: new Date(),
        },
      })
      return response.data.user
    },
    {
      onSuccess: () => {
        // queryClient.invalidateQueries(['users', 1]) invalidate only page 1
        queryClient.invalidateQueries('users') // invalidate all users pages
      },
    }
  )
  // onSuccess we want to reset the users cache, because the data has been modified

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserCreateFormData>({
    resolver: yupResolver(userCreateFormSchema),
  })

  const handleCreateUser = handleSubmit(async (data) => {
    // const a = await new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     resolve('Resolved')
    //   }, 2000)
    // })
    // console.log(a)
    // console.log(data)
    await createUser.mutateAsync(data)

    router.push('/users')
  })

  if (isLoading)
    return (
      <Flex alignItems="center" justifyContent="center" w="100vw" h="100vh">
        <Spinner color="pink.500" size="xl" />
      </Flex>
    )

  return (
    <Box>
      <Header isMobile={isMobile} />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar isMobile={isMobile} />

        <Box
          as="form"
          onSubmit={handleCreateUser}
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p={['6', '8']}
        >
          <Heading size="lg" fontWeight="normal">
            Criar usuário
          </Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
              <Input
                {...register('name')}
                label="Nome Completo"
                error={errors.name}
              />
              <Input
                {...register('email')}
                type="email"
                label="E-mail"
                error={errors.email}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
              <Input
                {...register('password')}
                type="password"
                label="Senha"
                error={errors.password}
              />
              <Input
                {...register('password_confirmation')}
                type="password"
                label="Confirmação da senha"
                error={errors.password_confirmation}
              />
            </SimpleGrid>
          </VStack>
          <Flex mt="8" justify={['center', 'flex-end']}>
            <HStack spacing="4">
              <Link href="/users" passHref>
                <Button as="a" colorScheme="whiteAlpha">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" colorScheme="pink" isLoading={isSubmitting}>
                Salvar
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}
