import Head from 'next/head'
import NavBar from '../navbar'
import { Box } from '@chakra-ui/react'
import Script from "next/script"

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

          <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.min.js" integrity="sha384-Rx+T1VzGupg4BHQYs2gCW9It+akI2MM/mndMCy36UVfodzcJcF0GGLxZIzObiEfa" crossOrigin="anonymous"></Script>
          <Script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.4/js/lightbox.js"></Script>
          {children}
          
        </Box>
      </Box>
    )
  }
  
  export default Main