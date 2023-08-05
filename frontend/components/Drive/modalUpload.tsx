import React, { useEffect, useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack
} from '@chakra-ui/react'

const ModalUpload = ({ initialRef, finalRef, isOpen, onClose, callAPI, currentPath }) => {
    const [selectedFiles, setSelectedFiles] = useState([])

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files)
        setSelectedFiles(files)
    };

    const handleUpload = () => {
        // Implement your file upload logic here
        console.log(selectedFiles)
    }

    function callPage() {
        // Make the initial API call when the component mounts
        callAPI(currentPath)
    }

    return (
        <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Upload files</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
                <Input type="file" multiple onChange={handleFileChange} />
            </ModalBody>

            <ModalFooter>
                <Button 
                onClick={() => {
                    handleUpload()
                    callPage()
                }}
                colorScheme='blue' mr={3}>
                    Upload
                </Button>
                <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
)}

export default ModalUpload