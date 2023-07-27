import React, { useEffect, useState } from 'react'
import Logs from '@/types/Logs'
import Loading from '@/components/Loading'

const APIURL = process.env.NEXT_PUBLIC_DRIVE_ENDPOINT + ':' + process.env.NEXT_PUBLIC_DRIVE_ENDPOINT_PORT + '/api/v1/error/log/'


const ErrorLogs = () => {
    const [log, setLog] = useState<Logs | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    function callAPI () {
        setLoading(true)

        console.log(APIURL)

        fetch(APIURL)
            .then(async (res) => {
                // set the data if the response is successful
                const log = await res.json()
                setLog(log)
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
        callAPI()
    }, [])

    // display for error component
    const errorComponent = <div className="text-red-500">Error: {error}</div>

    return (
        <div>
          {loading ? (
            Loading
          ) : error ? (
            errorComponent
          ) : (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Error Id
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Error Code
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Error Info
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Error Date
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {log?.map((errorlog, index) => (
                        <tr key={index} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {errorlog.error_id}
                            </th>
                            <td className="px-6 py-4">
                                {errorlog.error_code}
                            </td>
                            <td className="px-6 py-4">
                                {errorlog.error_traceback ? errorlog.error_traceback.substring(0, 30) : ''}...
                            </td>
                            <td className="px-6 py-4">
                                {errorlog.error_date}
                            </td>
                            <td className="px-6 py-4">
                                <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View More</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      )}
      </div>
    )
}

export default ErrorLogs