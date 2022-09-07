import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react'
import { useSidebarDrawer } from '../../contexts/SidebarDrawerContext'
import { SidebarNav } from './SidebarNav'
interface SidebarProps {
  isMobile: boolean
}

export function Sidebar({ isMobile }: SidebarProps) {
  const { isOpen, onClose } = useSidebarDrawer()

  return (
    <>
      {isMobile ? (
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay>
            <DrawerContent bg="gray.800" p="4">
              <DrawerCloseButton mt="6" />
              <DrawerHeader>Navegação</DrawerHeader>

              <DrawerBody>
                <SidebarNav />
              </DrawerBody>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>
      ) : (
        <Box as="aside" w="64" mr="8">
          <SidebarNav />
        </Box>
      )}
    </>
  )
}
