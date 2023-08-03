import { useEffect, useState } from 'react'
import {
  Link,
  Container,
  Heading,
  Box,
  Button,
  Spinner,
  Flex
} from '@chakra-ui/react'
import Layout from '@/components/layouts/article'
import Alerts from '@/components/Alerts'
import Alert500 from '@/components/Alert500'
import Drive from '@/lib/types/Drive'
import Error from '@/lib/types/Error'
import Directories from '@/components/Drive/directories'
import Breadcrumbs from '@/components/Drive/breadcrumbs'
import ImagesGallery from '@/components/Drive/imageGallery'
import VideosGallery from '@/components/Drive/videoGallery'

const ServerMediaURL = process.env.NEXT_PUBLIC_CLOUDSTATION_ENDPOINT + ':' + process.env.NEXT_PUBLIC_CLOUDSTATION_ENDPOINT_PORT + '/media/v1'
const APIURL = process.env.NEXT_PUBLIC_CLOUDSTATION_ENDPOINT + ':' + process.env.NEXT_PUBLIC_CLOUDSTATION_ENDPOINT_PORT + '/api/v1/drive/'
let breadcrumbs: string[] = []

const Drive = () => {

    const [data, setData] = useState<Drive | null>(null)
    const [errordata, setErrorData] = useState<Error | null>(null)
    const [loading, setLoading] = useState(false)

    function callAPI(relativePath: string) {
        setLoading(true)
        setErrorData(null)

        console.log(APIURL + relativePath)

        fetch(APIURL + relativePath)
            .then(async (res) => {
                // set the data if the response is successful
                const drive = await res.json()

                if (drive?.is_error) {
                    setErrorData(drive)
                } else {
                    setData(drive)
                    breadcrumbs = relativePath.split("/")
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

    return(
        <>
            <Layout title={"Drive"}>
                {loading ? (
                    /* Loading Page if is True */
                    <Flex
                    height="100vh"
                    justifyContent="center"
                    alignItems="center">
                        <Spinner size="xl"/>
                    </Flex>
                ) : data?.is_error ? (
                    errordata?.status_code !== 500 ? (
                        <Alerts status_code={errordata?.status_code} error_message={errordata?.error_message} error_code={errordata?.error_code}/>
                    ) : (
                        <Alert500 status_code={errordata?.status_code} error_code={errordata?.error_code}/>
                    )
                ) : (
                    <>
                        <Box p={5}>
                            <Breadcrumbs breadcrumbItems={breadcrumbs} callAPI={callAPI}/>
                        </Box>
                        <Box>
                            <Directories directories={data?.drive.directories} callAPI={callAPI}/>
                        </Box>
                        <Box>
                            <ImagesGallery images={data?.drive.images} ServerMediaURL={ServerMediaURL}/>
                        </Box>
                        <Box>
                            <VideosGallery videos={data?.drive.videos} ServerMediaURL={ServerMediaURL}/>
                        </Box>
                    </>
                        
                )}
            </Layout>
        </>
    )
}

export default Drive