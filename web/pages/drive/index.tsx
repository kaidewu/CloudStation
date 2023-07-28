import React, { useEffect, useState } from 'react'
import Drive from '@/types/Drive'
import Error from '@/types/Error'
import Image from 'next/image'
import { Player } from 'video-react'
import Loading from '@/components/Loading'
import Alert404 from '@/components/Alerts/Alert404'
import Alert500 from '@/components/Alerts/Alert500'
import Breadcrumbs from '@/components/Breadcrumbs'
import BackTopButton from '@/components/BackTopButton'

const ServerMediaURL = process.env.NEXT_PUBLIC_SERVER_MEDIA_ENDPOINT + ':' + process.env.NEXT_PUBLIC_SERVER_MEDIA_ENDPOINT_PORT
const APIURL = process.env.NEXT_PUBLIC_DRIVE_ENDPOINT + ':' + process.env.NEXT_PUBLIC_DRIVE_ENDPOINT_PORT + '/api/v1/drive/'
let breadcrumbs: string[] = []

const Drive = () => {
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
                if (e instanceof Error) {
                    setError(e.message)
                }
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
        <>
            <div className="flex items-center py-4 overflow-x-auto whitespace-nowrap">
                <a onClick={() => callAPI("")} className="text-gray-900 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                </a>

                <Breadcrumbs breadcrumbs={breadcrumbs} callAPI={callAPI}/>
            </div>
          {loading ? (
            Loading
          ) : error ? (
            errorComponent
          ) : errordata?.is_error ? (
            errordata?.status_code !== 500 ? (
                <Alert404 status_code={errordata.status_code} error_message={errordata.error_message}/>
              ) : (
                <Alert500 status_code={errordata.status_code} error_message={errordata.error_message}/>
              )
          ) : (
                <>
                    {/* Show Directories */}
                    <div className="Directories">
                        <ul className="h-auto max-w-full rounded-lg">
                            {data?.drive.directories.map((diretory, index) => (
                                <li key={index} className='hover:bg-gray-50 dark:hover:bg-gray-600'>
                                    <a onClick={() => callAPI(diretory.directory_relative_path)}>{ diretory.directory_name }</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Show Images */}
                    <div className="Images">
                        <div className="container mx-auto px-3 py-2 lg:px-32 lg:pt-12">
                            <div className="-m-1 flex flex-wrap md:-m-2">
                                {data?.drive.images.map((image, index) => (
                                    <div key={index} className="flex w-1/3 flex-wrap">
                                        <div className="w-full p-1 md:p-2">
                                            <Image
                                                className="block h-full w-full rounded-lg object-cover object-center"
                                                src={`${ServerMediaURL}/${image.image_relative_path}`} 
                                                alt={image.image_name}
                                                height={image.image_dimensions.height / 10}
                                                width={image.image_dimensions.width /10}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Show Videos */}
                    <div className="Videos">
                        <ul>
                            {data?.drive.videos.map((video, index) => (
                                <li key={index} className='hover:bg-gray-50 dark:hover:bg-gray-600'>
                                    <Player 
                                        src={`${ServerMediaURL}/${video.video_relative_path}`}
                                        height={(video.video_dimensions.height) / 10}
                                        width={(video.video_dimensions.width) / 10}
                                    />
                                </li>
                            ))}
                        </ul>
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
                </>
            )}
            { BackTopButton }
        </>
      )
}

export default Drive