import { useMediaQuery } from '@chakra-ui/react'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

const MediaQueryContext = createContext({})

interface MediaQueryProviderProps {
  children: ReactNode
}

// I've created this context because ChakraUI in 1.8.3 has an issue with its responsive hooks
// although without the loading state the application runs perfectly, there will be an error
// caused by chakraUI when you have conditional JSX based on the responsive hook, e.g.:
// {isSmallerThan768 ? <h1>Is smaller</h1> : <h1>Is not smaller</h1>}
// will trigger an erorr in the browser console

// See https://github.com/chakra-ui/chakra-ui/issues/5506
export function MediaQueryProvider({ children }: MediaQueryProviderProps) {
  const [isSmallerThan768] = useMediaQuery('(max-width: 768px)')

  const [isMobile, setIsMobile] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // setTimeout(() => {
    setIsMobile(isSmallerThan768)
    setIsLoading(false)
    // }, 2000)
  }, [isSmallerThan768])

  return (
    <MediaQueryContext.Provider value={{ isMobile, isLoading }}>
      {children}
    </MediaQueryContext.Provider>
  )
}

export const useMediaQueryContext = () => useContext(MediaQueryContext)
