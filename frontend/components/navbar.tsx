import {
  Container,
  Box,
  Link,
  Stack,
  Heading,
  Flex,
  Menu,
  MenuItem,
  MenuList,
  MenuButton,
  IconButton,
  useColorModeValue
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import ThemeToggleButton from './theme-toggle-button'
import { IoLogoGithub } from 'react-icons/io5'
import NextLink from 'next/link'

const LinkItem = ({ href, path, children, ...props }) => {
  const active = path === href
  const inactiveColor = useColorModeValue('gray.800', 'whiteAlpha.900')
  return (
    <Link
      as={NextLink}
      href={href}
      p={2}
      bg={active ? 'grassTeal' : undefined}
      color={active ? '#202023' : inactiveColor}
      {...props}
    >
      {children}
    </Link>
  )
}

const Navbar = props => {
  const { path } = props

  return (
    <Box
      position="fixed"
      as="nav"
      w="100%"
      bg={useColorModeValue('#ffffff40', '#20202380')}
      css={{ backdropFilter: 'blur(10px)' }}
      zIndex={5}
      {...props}
    >
      <Container
        display="flex"
        p={2}
        maxW="container.md"
        alignItems="center"
        justifyItems="space-between"
      >
        <Flex align="center" mr={10}>
          <Heading as="h1" size="lg" letterSpacing={'tighter'}>
            {/* Deberia ir el logo aqui */}
          </Heading>
        </Flex>

        <Stack
          direction={{ base: 'column', md: 'row' }}
          display={{ base: 'none', md: 'flex' }}
          width={{ base: 'full', md: 'auto' }}
          alignItems="center"
          flexGrow={1}
          mt={{ base: 4, md: 0 }}
        >
          <LinkItem href="/" path={path}>
            Home
          </LinkItem>
          <LinkItem href="/drive" path={path}>
            Drive
          </LinkItem>
          <LinkItem href="/logs" path={path}>
            Logs
          </LinkItem>
          <LinkItem
            href="https://github.com/kaidewu/cloudStation"
            path={path}
            display="inline-flex"
            alignItems="center"
            style={{ gap: 4 }}
            pl={2}
          >
            <IoLogoGithub />
            Source
          </LinkItem>
        </Stack>

        <Box flex={1} alignItems="right">
          <ThemeToggleButton />

          <Box ml={2} display={{ base: 'inline-block', md: 'none' }}>
            <Menu isLazy id="navbar-menu">
              <MenuButton
                as={IconButton}
                icon={<HamburgerIcon />}
                variant="outline"
                aria-label="Options"
              />
              <MenuList>
                <MenuItem as={Link} href="/">
                  Home
                </MenuItem>
                <MenuItem as={Link} href="/drive">
                  Drive
                </MenuItem>
                <MenuItem as={Link} href="/logs">
                  Logs
                </MenuItem>
                <MenuItem
                  as={Link}
                  href="https://github.com/kaidewu/cloudStation"
                >
                  View Source
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Navbar