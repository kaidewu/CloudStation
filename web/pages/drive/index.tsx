import React, { useEffect, useState } from 'react'
import Drive from '@/types/Drive'
import Error from '@/types/Error'
import Loading from '@/components/Loading'
import Alert404 from '@/components/Alerts/Alert404'
import Alert500 from '@/components/Alerts/Alert500'
import Breadcrumbs from '@/components/Drive/Breadcrumbs'
import Navbar from '@/components/Navbar'
import ImagesGallery from '@/components/Drive/ImagesGallery'
import DirectoriesGallery from '@/components/Drive/DirectoriesGallery'
import VideosGallery from '@/components/Drive/VideosGallery'

const ServerMediaURL = process.env.NEXT_PUBLIC_CLOUDSTATION_ENDPOINT + ':' + process.env.NEXT_PUBLIC_CLOUDSTATION_ENDPOINT_PORT + '/media/v1'
const APIURL = process.env.NEXT_PUBLIC_CLOUDSTATION_ENDPOINT + ':' + process.env.NEXT_PUBLIC_CLOUDSTATION_ENDPOINT_PORT + '/api/v1/drive/'
let breadcrumbs: string[] = []

const DrivePage = () => {
    const [data, setData] = useState<Drive | null>(null)
    const [errordata, setErrorData] = useState<Error | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    function callAPI (relativePath: string) {
        setLoading(true)
        setErrorData(null)

        console.log(APIURL + relativePath)

        fetch(APIURL + relativePath)
            .then(async (res) => {
                // set the data if the response is successful
                const drive = await res.json()
                if (!drive.is_error){
                    setData(drive)
                    breadcrumbs = relativePath.split("/")
                } else {
                    setErrorData(drive)
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
        callAPI('')
    }, [])

    // display for error component
    const errorComponent = <div className="text-red-500">Error: {error}</div>

    // display loading, error and data based on the state
    return (
        <div>
            {loading ? (
                /* Loading Page if is True */
                Loading
            ) : error ? (
                /* Error Page if callAPI returns error */
                errorComponent
            ) : errordata?.is_error ? (
                errordata?.status_code !== 500 ? (
                    <Alert404 status_code={errordata.status_code} error_message={errordata.error_message} error_code={errordata.error_code}/>
                ) : (
                    <Alert500 status_code={errordata.status_code} error_message={errordata.error_message} error_code={errordata.error_code}/>
                )
            ) : (
                <>
                <Navbar/>
                <div className="p-20">
                    {/* Breadcrumbs */}
                    <div className="flex items-center py-4 overflow-x-auto whitespace-nowrap">
                        <a onClick={() => callAPI("")} className="text-gray-900 dark:text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                        </a>
                        <Breadcrumbs breadcrumbs={breadcrumbs} callAPI={callAPI}/>
                    </div>
                    {/* Show Directories */}
                    <div className="Directories">
                        <DirectoriesGallery data={data} callAPI={callAPI} />
                    </div>
                    {/* Show Images */}
                    <div className="Images">
                        <ImagesGallery data={data} ServerMediaURL={ServerMediaURL} />
                    </div>
                    {/* Show Videos */}
                    <div className="Videos">
                        <VideosGallery data={data} ServerMediaURL={ServerMediaURL} />
                    </div>
                    {/* Show Others */}
                    <div className="Others">
                        <ul>
                            {data?.drive.others.map((other, index) => (
                                <li key={index} className='hover:bg-gray-50 dark:hover:bg-gray-600'>
                                    {other.other_name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                </>
            )}
        </div>
      )
}

export default DrivePage 