import NextLink from 'next/link'
import {
  Box,
  Heading,
  Text,
  Container,
  Divider,
  Button
} from '@chakra-ui/react'

const InternalError = () => {
  return (
    <Container>
      <Heading as="h1">Internal Error</Heading>
      <Text>Oops! Something happend in the server.</Text>
      <Text>Contanct to the administrator!</Text>
      <Divider my={6} />
      <Box my={6} alignItems="center">
        <Button as={NextLink} href="/" colorScheme="teal">
          Return to home
        </Button>
      </Box>
    </Container>
  )
}

export default InternalError