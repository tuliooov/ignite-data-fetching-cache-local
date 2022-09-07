import { Avatar, Box, Flex, Text, useMediaQuery } from '@chakra-ui/react'

interface ProfileProps {
  showDataProfile: boolean
}

export function Profile({ showDataProfile }: ProfileProps) {
  return (
    <Flex align="center">
      {showDataProfile && (
        <Box mr="4" textAlign="right">
          <Text>Felipe Curcio</Text>
          <Text color="gray.300" fontSize="small">
            felipe_nieto010@hotmail.com
          </Text>
        </Box>
      )}
      <Avatar
        size="md"
        name="Felipe Curcio"
        src="https://github.com/NietoCurcio.png"
      />
    </Flex>
  )
}
