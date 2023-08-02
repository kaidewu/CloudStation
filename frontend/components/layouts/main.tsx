import Head from 'next/head'
import NavBar from '../navbar'
import { Box, Container } from '@chakra-ui/react'

const Main = ({ children, router }) => {
    return (
      <Box as="main" pb={4}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="Kaide's Cloud Station" />
          <meta name="author" content="Kaide Wu" />
          <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
          <title>CloudStation</title>
        </Head>
  
        <NavBar path={router.asPath} />
  
        <Box pt={14}>
  
          {children}
  
        </Box>
      </Box>
    )
  }
  
  export default Main