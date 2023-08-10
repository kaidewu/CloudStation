import React, { useEffect, useState } from 'react'
import Layout from '@/components/layouts/article'
import Error from '@/lib/types/Error'
import Settings from '@/lib/types/Settings'
import Alerts from '@/components/Alerts'
import Alert500 from '@/components/Alert500'
import {
    Box,
    Button,
    Flex,
    Spinner,
    Input,
    Heading,
    Container,
    FormControl,
    FormLabel
  } from '@chakra-ui/react'

const SettingsDriveEndpoint = process.env.NEXT_PUBLIC_CLOUDSTATION_ENDPOINT + ':' + process.env.NEXT_PUBLIC_CLOUDSTATION_ENDPOINT_PORT + '/api/v1/settings/drive'

const Settings = () => {
    const [settings, setSettings] = useState<Settings | null>(null)
    const [errordata, setErrorData] = useState<Error | null>(null)
    const [loading, setLoading] = useState(false)

    function callAPI() {
        setLoading(true)
    
        fetch(SettingsDriveEndpoint)
            .then(async (res) => {
                // set the data if the response is successful
                const data = await res.json()
    
                if (data?.is_error) {
                  setErrorData(data)
                } else {
                    setSettings(data)
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
          callAPI()
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
            ) : settings?.is_error ? (
                errordata?.status_code !== 500 ? (
                    <Alerts status_code={errordata?.status_code} error_message={errordata?.error_message} error_code={errordata?.error_code}/>
                ) : (
                    <Alert500 status_code={errordata?.status_code} error_code={errordata?.error_code}/>
                )
            ) : (
                <Container>
                    <FormControl isRequired>
                        <FormLabel>Storage Path</FormLabel>
                        <Input placeholder='Path' defaultValue={settings?.basepath} />
                        <Button>Confirm</Button>
                    </FormControl>
                </Container>
            )}
        </Layout>
    )
}

export default Settings