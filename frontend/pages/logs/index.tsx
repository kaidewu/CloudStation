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
import { DeleteIcon, ViewIcon } from '@chakra-ui/icons'
import Layout from '@/components/layouts/article'
import Logs from '@/lib/types/Logs'
import Error from '@/lib/types/Error'
import Alerts from '@/components/Alerts'
import Alert500 from '@/components/Alert500'

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
                            <Button>
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