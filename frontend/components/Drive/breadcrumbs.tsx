import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Container,
    useDisclosure,
    Button,
    Box,
    Stack
} from '@chakra-ui/react'
import React, { useState } from 'react'
import ModalUpload from './modalUpload'

const Breadcrumbs = ({breadcrumbItems, callAPI}) => {
    const [currentPath, setCurrentPath] = useState("")
    let path_drive: string = ""
    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)

    const handleBreadcrumbClick = (path) => {
      setCurrentPath(path)
      callAPI(path)
    }

    return (
        <Box
        w="100%"
        zIndex={5}>
            <Container
            display="flex"
            p={2}
            maxW="container.md"
            alignItems="center"
            justifyItems="space-between">
                <Stack
                direction={{ base: 'column', md: 'row' }}
                display={{ base: 'none', md: 'flex' }}
                width={{ base: 'full', md: 'auto' }}
                alignItems="center"
                flexGrow={100}
                mt={{ base: 4, md: 0 }}>
                    <Breadcrumb>
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => handleBreadcrumbClick("")}>Home</BreadcrumbLink>
                        </BreadcrumbItem>
                    {breadcrumbItems.map((item, index) => {
                        const path = breadcrumbItems.slice(0, index + 1).join('/')
                        path_drive = path

                        return (
                            currentPath === path ? (
                                <BreadcrumbItem key={index} isCurrentPage>
                                    <BreadcrumbLink onClick={() => handleBreadcrumbClick(path)}>{ item }</BreadcrumbLink>
                                </BreadcrumbItem>
                            ): (
                                <BreadcrumbItem key={index}>
                                    <BreadcrumbLink onClick={() => handleBreadcrumbClick(path)}>{ item }</BreadcrumbLink>
                                </BreadcrumbItem>
                            )
                        )
                        })}
                    </Breadcrumb>
                </Stack>
                <Box flex={1} alignItems="right">
                    <Button onClick={onOpen}>Open Modal</Button>
                    <ModalUpload initialRef={initialRef} finalRef={finalRef} isOpen={isOpen} onClose={onClose} callAPI={callAPI} relativePath={path_drive}/>
                </Box>
            </Container>
        </Box>
        )

}

export default Breadcrumbs