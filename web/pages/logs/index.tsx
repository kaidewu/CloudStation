import React, { useEffect, useState } from 'react'
import Logs from '@/types/Logs'
import Loading from '@/components/Loading'
import Navbar from '@/components/Navbar'

const ErrorLogEnpoint = process.env.NEXT_PUBLIC_CLOUDSTATION_ENDPOINT + ':' + process.env.NEXT_PUBLIC_CLOUDSTATION_ENDPOINT_PORT + '/api/v1/error/log/?ErrorCode='

const ErrorLogs = () => {
  const [log, setLog] = useState<Logs[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedLog, setSelectedLog] = useState<Logs | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  function callAPI(errorCode: string) {
    setLoading(true)

    fetch(ErrorLogEnpoint + errorCode)
      .then(async (res) => {
        // set the data if the response is successful
        const logs = await res.json()
        setLog(logs)
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

  // Function to handle opening the modal and calling the API for selected log
  const handleViewMore = (errorCode: string) => {
    setIsModalOpen(true)
    setSelectedLog(null)

    // Call the API with the selected errorCode
    fetch(ErrorLogEnpoint + errorCode)
      .then(async (res) => {
        const selectedLogData = await res.json()
        setSelectedLog(selectedLogData)
      })
      .catch((e) => {
        setError(e.message)
      })
  }

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const ModalLogsContent = selectedLog?.map((data) => (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-xl" key={data.error_id}>
      <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {data.error_code}
        </h3>
        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span className="sr-only">Close modal</span>
        </button>
      </div>

      <div className="p-6 space-y-6">
        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
          {data.error_traceback}
        </p>
        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
          {data.error_date}
        </p>
      </div>
    </div>
  ))

  return (
    <div>
      <Navbar />
      {loading ? (
        Loading
      ) : error ? (
        errorComponent
      ) : (
        <div className="top-20 relative overflow-x-auto shadow-md sm:rounded-lg">
          {/* Table for logs */}
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400">
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
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
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
                    <button
                      data-modal-target="ErrorLogModal" 
                      data-modal-toggle="ErrorLogModal"
                      className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" 
                      type="button"
                      onClick={() => handleViewMore(errorlog.error_code)}
                    >
                      View more
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
              <div className="relative z-10 max-w-full overflow-hidden">
                {ModalLogsContent}
                <button
                  className="absolute top-0 right-0 m-4 p-2 text-white bg-gray-800 rounded-lg"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ErrorLogs
