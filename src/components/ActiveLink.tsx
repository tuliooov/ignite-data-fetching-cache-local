import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import { cloneElement, ReactElement } from 'react'

interface ActiveLinkProps extends LinkProps {
  children: ReactElement
  /* 
        the diffrence betweeen ReactElement and ReactNode
        is that ReactElement can only has a ReactNode
        or ReactElement as children (cannot has a string, or number) 
    */
}

export function ActiveLink({ children, ...rest }: ActiveLinkProps) {
  const { asPath } = useRouter()

  return (
    <Link {...rest}>
      {cloneElement(children, {
        color: asPath.startsWith(String(rest.href)) ? 'pink.400' : 'gray.50',
      })}
    </Link>
  )
}
