import { Icon, Link as ChakraLink, LinkProps, Text } from '@chakra-ui/react'
import { ElementType } from 'react'
import Link from 'next/link'
import { ActiveLink } from '../ActiveLink'

interface NavLinkProps extends LinkProps {
  icon: ElementType
  children: string
  // ElementType is a component, the difference between ElementType and ReactNode
  // is that <Component /> is a ReactNode and {Component} is a ElementType
  href: string
}

export function NavLink({ icon, children, href, ...rest }: NavLinkProps) {
  return (
    <ActiveLink href={href} passHref>
      <ChakraLink display="flex" alignItems="center" {...rest}>
        <Icon as={icon} fontSize="20" />
        <Text ml="4" fontWeight="medium">
          {children}
        </Text>
      </ChakraLink>
    </ActiveLink>
  )
}
