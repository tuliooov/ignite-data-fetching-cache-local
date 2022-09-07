import { Flex, Icon, IconButton } from '@chakra-ui/react'
import { RiMenuLine } from 'react-icons/ri'
import { useSidebarDrawer } from '../../contexts/SidebarDrawerContext'
import { Logo } from './Logo'
import { Notifications } from './Notifications'
import { Profile } from './Profile'
import { Search } from './Search'

interface HeaderProps {
  isMobile: boolean
}

export function Header({ isMobile }: HeaderProps) {
  const { onOpen } = useSidebarDrawer()

  return (
    <Flex
      as="header"
      w="100%"
      maxWidth={1480}
      h="20"
      mx="auto"
      mt="4"
      px="6"
      align="center"
    >
      {isMobile && (
        <IconButton
          aria-label="Open navigation"
          icon={<Icon as={RiMenuLine} />}
          fontSize="24"
          variant="unstyled"
          display="flex"
          alignItems="center"
          onClick={onOpen}
          mr="2"
        ></IconButton>
      )}

      <Logo />

      {!isMobile && <Search />}

      <Flex align="center" ml="auto">
        <Notifications />
        <Profile showDataProfile={!isMobile} />
      </Flex>
    </Flex>
  )
}
