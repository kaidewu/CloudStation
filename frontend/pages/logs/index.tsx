import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Spinner,
  useDisclosure,
  Heading
} from '@chakra-ui/react'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
import Layout from '@/components/layouts/article'
import Logs from '@/lib/types/Logs'
import Error from '@/lib/types/Error'
import Alerts from '@/components/Alerts'

const ErrorLogEndpoint = process.env.NEXT_PUBLIC_CLOUDSTATION_ENDPOINT + ':' + process.env.NEXT_PUBLIC_CLOUDSTATION_ENDPOINT_PORT + '/api/v1/error/log/?ErrorCode='

const Logs = () => {
  const [errorlog, setErrorLog] = useState<Logs | null>(null)
  const [errordata, setErrorData] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)

  function callAPI(errorCode: string) {
    setLoading(true)

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

  const removeErrorCode = async (errorCode: string) => {

    const bodyRemoveErrorCode = {
      "error_code": [errorCode]
    }

    try{
      const response = await fetch(`${process.env.NEXT_PUBLIC_CLOUDSTATION_ENDPOINT}:${process.env.NEXT_PUBLIC_CLOUDSTATION_ENDPOINT_PORT}/api/v1/error/log/remove`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyRemoveErrorCode, null, 2)
      })

      if (!response.ok) {
        throw new Error('Error')
      }

      // Implement your file upload logic here
      console.log(response.json())
    }
    catch(error) {
      console.error(error)
    }
    finally{
      callAPI("")
    }
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
            <Alerts errordata={errordata}/>
        ) : (
            <>
              <Box p={10}>
                <Accordion allowToggle>
                    {errorlog?.map((log, index) => {
                      return (
                        <AccordionItem key={index}>
                          <Heading>
                            <AccordionButton>
                              <Box as="span" flex='1' textAlign='left'>
                                {log?.error_code}
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                            <Button
                            onClick={() => (
                              removeErrorCode(log?.error_code)
                            )}>
                              <DeleteIcon />
                            </Button>
                          </Heading>
                          <AccordionPanel pb={4}>
                            Error: {log?.error_traceback}
                            <br/>
                            Error Date: {log?.error_date}
                          </AccordionPanel>
                        </AccordionItem>
                      )
                    })}
                </Accordion>
              </Box>
            </>
      )}
  </Layout>
  )
}

export default Logs