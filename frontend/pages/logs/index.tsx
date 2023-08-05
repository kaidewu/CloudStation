import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Spinner,
  useDisclosure
} from '@chakra-ui/react'
import {
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Td,
  Tbody
} from '@chakra-ui/react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react'
import Layout from '@/components/layouts/article'
import Logs from '@/lib/types/Logs'
import Error from '@/lib/types/Error'
import Alerts from '@/components/Alerts'
import Alert500 from '@/components/Alert500'

const ErrorLogEndpoint = process.env.NEXT_PUBLIC_CLOUDSTATION_ENDPOINT + ':' + process.env.NEXT_PUBLIC_CLOUDSTATION_ENDPOINT_PORT + '/api/v1/error/log/?ErrorCode='

const Logs = () => {
  const [errorlog, setErrorLog] = useState<Logs | null>(null)
  const [errordata, setErrorData] = useState<Error | null>(null)
  const [selectedLog, setSelectedLog] = useState<Logs | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const finalRef = React.useRef(null)

  function callAPI(errorCode: string) {
    setLoading(true)

    console.log(ErrorLogEndpoint + errorCode)

    fetch(ErrorLogEndpoint + errorCode)
        .then(async (res) => {
            // set the data if the response is successful
            const data = await res.json()

            if (data?.is_error) {
              setErrorData(data)
            } else {
              setErrorLog(data)
            }

        })
        .catch((e) => {
            // set the error if there's an error like 404, 400, etc
            console.log(e)
        })
        .finally(() => {
            // set loading to false after everything has completed.
            setLoading(false)
        })
  }

  useEffect(() => {
      // Make the initial API call when the component mounts
      callAPI("")
  }, [])

  // Function to handle opening the modal and calling the API for selected log
  const handleViewMore = (errorCode: string) => {
    setIsModalOpen(true)

    // Call the API with the selected errorCode
    fetch(ErrorLogEndpoint + errorCode)
      .then(async (res) => {
        const selectedLogData = await res.json()

        if (selectedLogData?.is_error) {
          setErrorData(selectedLogData)
        } else {
          setSelectedLog(selectedLogData)
        }

        console.info(selectedLog)
      })
      .catch((e) => {
        console.error(e.message)
      })
  }

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <Layout title={"Logs"}>
      {loading ? (
        /* Loading Page if is True */
        <Flex
        height="100vh"
        justifyContent="center"
        alignItems="center">
          <Spinner size="xl"/>
        </Flex>
        ) : errorlog?.is_error ? (
            errordata?.status_code !== 500 ? (
                <Alerts status_code={errordata?.status_code} error_message={errordata?.error_message} error_code={errordata?.error_code}/>
            ) : (
                <Alert500 status_code={errordata?.status_code} error_code={errordata?.error_code}/>
            )
        ) : (
            <>
              <Box p={10}>
                <TableContainer>
                  <Table variant="simple">
                    <TableCaption>Error Logs</TableCaption>
                    <Thead>
                      <Tr>
                        <Th>Error Code</Th>
                        <Th>Error Message</Th>
                        <Th>Error Date</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {errorlog?.map((log, index) => {
                        return (
                          <React.Fragment key={index}>
                            <Tr tabIndex={-1}>
                              <Td>
                                {log?.error_code}
                              </Td>
                              <Td>
                                {log?.error_traceback ? log?.error_traceback.substring(0, 30) : ''}...
                              </Td>
                              <Td>
                                {log?.error_date}
                              </Td>
                              <Button onClick={() => {
                                handleViewMore(log?.error_code)
                                onOpen()
                              }}>
                                View More
                              </Button>
                            </Tr>
                          </React.Fragment>
                        )
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>
                {/* Modal */}
                {isModalOpen && (
                  <Modal size={"xl"} finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    {loading ? (
                      /* Loading Page if is True */
                      <Flex
                      height="100vh"
                      justifyContent="center"
                      alignItems="center">
                        <Spinner size="xl"/>
                      </Flex>
                      ) : selectedLog?.is_error ? (
                          errordata?.status_code !== 500 ? (
                              <Alerts status_code={errordata?.status_code} error_message={errordata?.error_message} error_code={errordata?.error_code}/>
                          ) : (
                              <Alert500 status_code={errordata?.status_code} error_code={errordata?.error_code}/>
                          )
                      ) : (
                          <>
                            <ModalContent>
                              <ModalHeader>{selectedLog?.error_code}</ModalHeader>
                              <ModalCloseButton onClick={() => {
                                handleCloseModal() // Call the function when the close button is clicked
                                onClose() // Close the modal
                              }} />
                              <ModalBody pb={6}>
                                {selectedLog?.error_traceback}
                              </ModalBody>
                              <ModalFooter>
                                <Button mr={3} onClick={() => {
                                  handleCloseModal() // Call the function when the "Close" button is clicked
                                  onClose() // Close the modal
                                }}>
                                  Close
                                </Button>
                                <Button variant='ghost'>Edit</Button>
                              </ModalFooter>
                            </ModalContent>
                          </>
                      )}
                  </Modal>
                )}
              </Box>
            </>
      )}
  </Layout>
  )
}

export default Logs