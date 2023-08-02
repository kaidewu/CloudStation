import NextLink from 'next/link'
import {
  Link,
  Container,
  Heading,
  Box,
  SimpleGrid,
  Button,
  List,
  ListItem,
  useColorModeValue,
  chakra
} from '@chakra-ui/react'
import Layout from '@/components/layouts/article'


const Logs = () => (
  <Layout title={"Logs"}>
    <Container>
      <Box
        p={10}
        textAlign="center"
      >
        Under Development
        <Box my={6} alignItems="center">
          <Button as={NextLink} href="/" colorScheme="teal">
            Return to home
          </Button>
        </Box>
      </Box>

    </Container>
  </Layout>
)

export default Logs