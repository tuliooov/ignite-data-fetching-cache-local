import { Box, Flex, SimpleGrid, Spinner, Text, theme } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { Header } from '../components/Header'
import { Sidebar } from '../components/Sidebar'
import { ApexOptions } from 'apexcharts'
import { useMediaQueryContext } from '../contexts/MediaQueryContext'

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

/* 
  dynamic imports, because Chart expects to be used in browser calling the window API
  but with next uses ssr in a node.js environment, passing ssr: false this import will
  occur in client -side
*/

// https://nextjs.org/docs/advanced-features/dynamic-import

const options: ApexOptions = {
  chart: {
    toolbar: { show: false },
    zoom: {
      enabled: false,
    },
    foreColor: theme.colors.gray[500],
  },
  grid: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    enabled: false,
  },
  xaxis: {
    type: 'datetime',
    axisBorder: {
      color: theme.colors.gray[600],
    },
    axisTicks: {
      color: theme.colors.gray[600],
    },
    categories: [
      '2022-02-16T:00:00:00.000Z',
      '2022-02-17T:00:00:00.000Z',
      '2022-02-18T:00:00:00.000Z',
      '2022-02-19T:00:00:00.000Z',
      '2022-02-20T:00:00:00.000Z',
      '2022-02-21T:00:00:00.000Z',
    ],
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      opacityFrom: 0.7,
      opacityTo: 0.3,
    },
  },
}

const series = [
  {
    name: 'series-1',
    data: [30, 40, 45, 50, 49, 60],
  },
]

interface ReturnUseMediaQueryContext {
  isMobile: boolean
  isLoading: boolean
}

export default function Dashboard() {
  const { isMobile, isLoading } =
    useMediaQueryContext() as ReturnUseMediaQueryContext

  if (isLoading)
    return (
      <Flex alignItems="center" justifyContent="center" w="100vw" h="100vh">
        <Spinner color="pink.500" size="xl" />
      </Flex>
    )

  return (
    <Flex direction="column" h="100vh">
      <Header isMobile={isMobile} />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar isMobile={isMobile} />

        <SimpleGrid
          flex="1"
          gap="4"
          minChildWidth="320px"
          alignItems="flex-start"
        >
          <Box p={['6', '8']} bg="gray.800" borderRadius={8} h="100%" pb="4">
            <Text fontSize="lg" mb="4">
              Inscritos da semana
            </Text>
            <Chart type="area" height={160} options={options} series={series} />
          </Box>
          <Box p={['6', '8']} bg="gray.800" borderRadius={8} h="100%" pb="4">
            <Text fontSize="lg" mb="4">
              Taxa de abertura
            </Text>
            <Chart type="area" height={160} options={options} series={series} />
          </Box>
        </SimpleGrid>
      </Flex>
    </Flex>
  )
}
