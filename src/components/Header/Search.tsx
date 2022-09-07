import { Flex, Icon, Input, useMediaQuery } from '@chakra-ui/react'
import { useRef } from 'react'
import { RiSearchLine } from 'react-icons/ri'

export function Search() {
  const ref: any = useRef<HTMLInputElement>(null)

  return (
    <Flex
      flex="1"
      py="4"
      px="8"
      ml="6"
      maxWidth={400}
      alignSelf="center"
      color="gray.200"
      position="relative"
      bg="gray.800"
      borderRadius="full"
    >
      <Input
        color="gray.50"
        variant="unstyled"
        px="4"
        mr="4"
        placeholder="Buscar na plataforma"
        _placeholder={{ color: 'gray.400' }}
        ref={ref}
        onChange={(e) => console.log(ref.current.value)}
      />
      <Icon as={RiSearchLine} fontSize="20" />
    </Flex>
  )
}
