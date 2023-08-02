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


const Home = () => (
  <Layout title={"CloudStation"}>
    <Container>
      <Box
        p={10}
        textAlign="center"
      >
        Breadcrumbs
      </Box>

    </Container>
  </Layout>
)

export default Home