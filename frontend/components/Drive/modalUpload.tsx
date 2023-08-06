import React, { useEffect, useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Text
} from '@chakra-ui/react'

const ModalUpload = ({ initialRef, finalRef, isOpen, onClose, callAPI, relativePath }) => {
    const [selectedFiles, setSelectedFiles] = useState([])
    const [errorMessage, setErrorMessage] = useState("")

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files)
        setSelectedFiles(files)
    };

    const handleUpload = async () => {
        // Check if any files are selected
        if (selectedFiles.length === 0) {
            setErrorMessage('Please select one or more files to upload.')
            return
        }
    
        // Calculate the total size of the selected files
        const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0)
    
        // Check if totalSize exceeds 100 MB (in bytes)
        const maxSizeInBytes = 100 * 1024 * 1024 // 100 MB in bytes
        if (totalSize > maxSizeInBytes) {
            setErrorMessage('Total file size should not exceed 100 MB.')
            return
        }
    
        try {
            // Create a FormData object to send the files in the request
            const formData = new FormData()
            selectedFiles.forEach((file) => {
              formData.append('files', file)
            })
      
            // Perform the POST request to your API endpoint
            const response = await fetch(`${process.env.NEXT_PUBLIC_CLOUDSTATION_ENDPOINT}:${process.env.NEXT_PUBLIC_CLOUDSTATION_ENDPOINT_PORT}/api/v1/drive/${relativePath}`, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
              },
              body: formData,
            });
      
            if (!response.ok) {
              throw new Error('Failed to upload files.')
            }
      
            // Implement your file upload logic here
            console.log(response.json())

        } catch (error) {
            console.error(error)
            setErrorMessage('An error occurred while uploading files.')
        } finally {
            // Clear the selected files after upload
            setSelectedFiles([])
            setErrorMessage('')

            // Call your API to update the page after successful upload
            callPage()
        }
      }

    function callPage() {
        // Make the initial API call when the component mounts
        callAPI(relativePath)
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
            <ModalHeader>
                Upload files
                {errorMessage && <Text color="red" fontSize="sm" ml={2}>{errorMessage}</Text>}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
                <Input type="file" multiple onChange={handleFileChange} />
            </ModalBody>

            <ModalFooter>
                <Button 
                onClick={() => {
                    handleUpload()
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